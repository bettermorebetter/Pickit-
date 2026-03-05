/* ══════════════════════════════════════════════════════════════
   Food Photo Classifier — TensorFlow.js + MobileNet
   Dynamically loaded, admin-only. Classifies Google Places photos
   as food vs non-food to auto-set best main images.
══════════════════════════════════════════════════════════════ */

let model: any = null;
let loadPromise: Promise<any> | null = null;

// ImageNet food-related class substrings (MobileNet output)
const FOOD_KEYWORDS = [
  // Meats & proteins
  'meat', 'steak', 'pork', 'beef', 'chicken', 'lamb', 'bacon', 'ham',
  'meatloaf', 'meat_loaf', 'potpie', 'pot_pie',
  // Seafood
  'fish', 'sushi', 'lobster', 'crab', 'shrimp', 'prawn', 'eel',
  // Noodles & rice & grains
  'noodle', 'ramen', 'spaghetti', 'pasta', 'carbonara',
  'rice', 'fried_rice', 'risotto',
  // Bread & bakery
  'bread', 'bagel', 'pretzel', 'croissant', 'muffin',
  'dough', 'baguette', 'french_loaf',
  // Pizza, burger, hotdog
  'pizza', 'cheeseburger', 'hamburger', 'hotdog', 'hot_dog',
  // Vegetables
  'salad', 'broccoli', 'cauliflower', 'mushroom', 'corn',
  'cucumber', 'bell_pepper', 'zucchini', 'artichoke',
  'head_cabbage', 'cabbage', 'cardoon',
  // Fruits
  'apple', 'banana', 'orange', 'strawberry', 'lemon',
  'pineapple', 'fig', 'pomegranate', 'custard_apple',
  // Desserts & sweets
  'cake', 'ice_cream', 'icecream', 'chocolate', 'trifle',
  'custard', 'pudding', 'pie', 'cookie',
  // Soups & stews
  'soup', 'chowder', 'consomme',
  // Dumplings & wraps
  'dumpling', 'gyoza', 'wonton', 'burrito', 'taco',
  // Drinks (some food context)
  'espresso', 'latte',
  // Condiments & sauces
  'guacamole',
  // Cooking vessels (strong food signal)
  'frying_pan', 'skillet', 'wok',
  // Eating vessels
  'plate', 'bowl',
];

// Non-food classes that MobileNet might predict for restaurant exteriors/interiors
const NON_FOOD_KEYWORDS = [
  'restaurant', 'storefront', 'shop', 'door', 'window',
  'street', 'building', 'church', 'cinema', 'theater',
  'sign', 'menu', 'monitor', 'screen', 'desk',
  'chair', 'table', 'bench', 'couch',
  'car', 'bicycle', 'bus', 'truck',
  'person', 'man', 'woman',
];

async function ensureModel(): Promise<any> {
  if (model) return model;
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    const tf = await import('@tensorflow/tfjs');
    const mobilenet = await import('@tensorflow-models/mobilenet');
    await tf.ready();
    model = await mobilenet.load({ version: 2, alpha: 0.5 });
    return model;
  })();

  return loadPromise;
}

function isFoodClass(className: string): boolean {
  const lower = className.toLowerCase().replace(/[\s,]+/g, '_');
  return FOOD_KEYWORDS.some(kw => lower.includes(kw));
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    const timer = setTimeout(() => reject(new Error('timeout')), 8000);
    img.onload = () => { clearTimeout(timer); resolve(img); };
    img.onerror = () => { clearTimeout(timer); reject(new Error('load_error')); };
    img.src = url;
  });
}

export interface ClassifyResult {
  url: string;
  isFood: boolean;
  confidence: number;
  className: string;
}

export async function classifyPhoto(url: string): Promise<ClassifyResult> {
  try {
    const m = await ensureModel();
    const img = await loadImage(url);
    const predictions = await m.classify(img, 5);

    // Check if any top-5 prediction is food-related
    for (const p of predictions) {
      if (isFoodClass(p.className)) {
        return { url, isFood: true, confidence: p.probability, className: p.className };
      }
    }

    return {
      url,
      isFood: false,
      confidence: predictions[0]?.probability || 0,
      className: predictions[0]?.className || 'unknown',
    };
  } catch (_e) {
    return { url, isFood: false, confidence: 0, className: 'error' };
  }
}

/**
 * Classify multiple photos and reorder: food photos first, then non-food.
 * Returns reordered URL array.
 */
export async function reorderByFood(photoUrls: string[]): Promise<{ urls: string[]; foodCount: number }> {
  if (!photoUrls.length) return { urls: [], foodCount: 0 };

  const results = await Promise.all(photoUrls.map(classifyPhoto));
  const food = results.filter(r => r.isFood).sort((a, b) => b.confidence - a.confidence);
  const nonFood = results.filter(r => !r.isFood);

  return {
    urls: [...food.map(r => r.url), ...nonFood.map(r => r.url)],
    foodCount: food.length,
  };
}

/**
 * Pre-load the model (call early so it's ready when needed).
 */
export async function preloadModel(): Promise<void> {
  try { await ensureModel(); } catch (_e) { /* ignore */ }
}

export function isModelReady(): boolean {
  return model !== null;
}
