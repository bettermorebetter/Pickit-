/* ══════════════════════════════════════════════════════════════
   Photo pool data — Unsplash URLs for food categories
══════════════════════════════════════════════════════════════ */

const _P = 'https://images.unsplash.com/photo-';
const _Q = '?auto=format&fit=crop&w=800&q=80';

/** Fallback photos used in main app (FOOD_PHOTO_URLS from main.js) */
export const FOOD_PHOTO_URLS: Record<string, string[]> = {
  kalguksu: [
    _P + 'B3VTHOLngWA' + _Q,
    _P + 'klAwNfxM9-g' + _Q,
    _P + 'TWSi2lukfSU' + _Q,
    _P + '5DsTEP06774' + _Q,
    _P + 'NFQi_2HUNRI' + _Q,
  ],
  haejangguk: [
    _P + 'eI_Uk6uGCOQ' + _Q,
    _P + 'VVPC-DEBi2I' + _Q,
    _P + 'vPMQl71yFDI' + _Q,
    _P + 'NFQi_2HUNRI' + _Q,
    _P + 'klAwNfxM9-g' + _Q,
  ],
  ramen: [
    _P + 'lp1pFuUolRI' + _Q,
    _P + 'rAyCBQTH7ws' + _Q,
    _P + 'ecwfh7Juzeo' + _Q,
    _P + 'YFU0AvczmLk' + _Q,
    _P + '1zlLiOT81Jw' + _Q,
    _P + '0hwsfnitZe4' + _Q,
    _P + 'SdS_XZ2CBqo' + _Q,
  ],
  sushi: [
    _P + 'tAY4RVDefDM' + _Q,
    _P + '0NyhHRsISA4' + _Q,
    _P + 'kXOPcslsae8' + _Q,
    _P + 'O27wBtVIHFI' + _Q,
    _P + 'N5r1MGJQN1E' + _Q,
  ],
  chinese: [
    _P + '78jWkCp_jdM' + _Q,
    _P + 'ok7sOEEgId0' + _Q,
    _P + 'vPMQl71yFDI' + _Q,
    _P + 'NFQi_2HUNRI' + _Q,
    _P + 'B3VTHOLngWA' + _Q,
  ],
  dumpling: [
    _P + 'klTf2RN37Ts' + _Q,
    _P + 'ok7sOEEgId0' + _Q,
    _P + 'nEoSC-abYMs' + _Q,
    _P + 'GZe_M6TUJ_k' + _Q,
    _P + 'hLSSPqULFZs' + _Q,
    _P + 'rioTUXsDImc' + _Q,
  ],
  pasta: [
    _P + '7ClANzfw6iU' + _Q,
    _P + 'Nx3OCfnRit8' + _Q,
    _P + '3rKZKXsiCUY' + _Q,
    _P + 'CatcixzdUcg' + _Q,
    _P + 'OC3lZI9P6kU' + _Q,
  ],
  burger: [
    _P + 'pucP6jZSyV4' + _Q,
    _P + 'sc5sTPMrVfk' + _Q,
    _P + '9Bqiusimq6M' + _Q,
    _P + 'egC8A3EWFms' + _Q,
    _P + '1kA3lACHeqk' + _Q,
    _P + 'jh5XyK4Rr3Y' + _Q,
  ],
  koreanBbq: [
    _P + 'ebNZJGWd4zY' + _Q,
    _P + 'F-wom_-3mZY' + _Q,
    _P + 'uIiMSu88RZQ' + _Q,
    _P + 'x76Pa3Ni3ak' + _Q,
    _P + 'D99y38Na5Xo' + _Q,
    _P + 'OhQEJezb6eA' + _Q,
  ],
  dakhanmari: [
    _P + 'eI_Uk6uGCOQ' + _Q,
    _P + 'VVPC-DEBi2I' + _Q,
    _P + 'vPMQl71yFDI' + _Q,
    _P + '5DsTEP06774' + _Q,
    _P + 'klAwNfxM9-g' + _Q,
  ],
  yakitori: [
    _P + 'FOZbF67e-DE' + _Q,
    _P + 'ioWiIP01HFQ' + _Q,
    _P + 'vlXAcYROlKY' + _Q,
    _P + 'BqK3fmNTv_g' + _Q,
    _P + 'RbI-U-WRuLw' + _Q,
  ],
  pizza: [
    _P + 'p7Q36vPBFs8' + _Q,
    _P + 'L4W1uX1xwlQ' + _Q,
    _P + 'wgq8NVyXsYY' + _Q,
    _P + 'drd0LG_kYE8' + _Q,
    _P + 'YKvGUO4Zb7Y' + _Q,
  ],
  korean: [
    _P + 'TWSi2lukfSU' + _Q,
    _P + 'klAwNfxM9-g' + _Q,
    _P + 'ebNZJGWd4zY' + _Q,
    _P + 'eI_Uk6uGCOQ' + _Q,
    _P + '5DsTEP06774' + _Q,
  ],
};

/** Curated photo pools — 15 photos per cuisine (from restaurants-data.js) */
export const PHOTO_POOLS: Record<string, string[]> = {
  kalguksu: [
    _P+'4_AWx8zgkbM'+_Q, _P+'x6tIjqCygXs'+_Q, _P+'inraxGxJUts'+_Q,
    _P+'XPeW43m8zm4'+_Q, _P+'un6jjbJlJZ0'+_Q, _P+'lwTUcjBgFXI'+_Q,
    _P+'pBCvCOQeLGg'+_Q, _P+'LwYxs3g04NE'+_Q, _P+'89-7W4kO294'+_Q,
    _P+'vmu5RqdzpBo'+_Q, _P+'TWSi2lukfSU'+_Q, _P+'8SyBZfFZsO0'+_Q,
    _P+'uIxdoVhexpI'+_Q, _P+'jgYtFeKmloU'+_Q, _P+'M-vG5uWAE0Q'+_Q,
  ],
  koreanBbq: [
    _P+'hl2jGkJmGrY'+_Q, _P+'hWxFxd-VySY'+_Q, _P+'T19z2Ud-t30'+_Q,
    _P+'WDJB-UA_yQY'+_Q, _P+'dBl6dnIIJeY'+_Q, _P+'rqY7YWZTKDQ'+_Q,
    _P+'uRrKbxHiazE'+_Q, _P+'-v3QPRntwTI'+_Q, _P+'wPRMZJkX0O0'+_Q,
    _P+'gNAa2jhyshM'+_Q, _P+'jPW0VFLAhMg'+_Q, _P+'GBi9ZdmipYg'+_Q,
    _P+'lYOeSN6oaJw'+_Q, _P+'O27wBtVIHFI'+_Q, _P+'TEOLSHYKh2M'+_Q,
  ],
  dakhanmari: [
    _P+'7SiLKNvPyDc'+_Q, _P+'i0WnxXGJUvE'+_Q, _P+'y_xypS3pRYA'+_Q,
    _P+'VtNLbOAeO68'+_Q, _P+'Kh2A54Ev1Po'+_Q, _P+'YH9v4EC4Q_0'+_Q,
    _P+'8azrSXsMUis'+_Q, _P+'4fjAh8Gue_U'+_Q, _P+'wkIe_TLBPkU'+_Q,
    _P+'P8MXephSELc'+_Q, _P+'8SyJAOhj_tI'+_Q, _P+'RVszLk1-AJ8'+_Q,
    _P+'OBOXfXKrpqs'+_Q, _P+'y1rk7mVL-QU'+_Q, _P+'gDwy_JEoz8k'+_Q,
  ],
  ramen: [
    _P+'tYOmq3WeSH0'+_Q, _P+'vPMQl71yFDI'+_Q, _P+'KRYuPwvyEys'+_Q,
    _P+'hfnKtULM4so'+_Q, _P+'fqgRRX_afAw'+_Q, _P+'x2AdZdiv9FM'+_Q,
    _P+'xZXGgrRppaA'+_Q, _P+'fuq9iwil_-U'+_Q, _P+'wSbKKiiZFqM'+_Q,
    _P+'0NwrMLZE2MY'+_Q, _P+'UeUdxYPb6ss'+_Q, _P+'dkv8WOkgMC0'+_Q,
    _P+'DSmrbF81QEE'+_Q, _P+'0VEqjWbsnLQ'+_Q, _P+'xGMX4Y2YgWY'+_Q,
  ],
  sushi: [
    _P+'vqldoNYRDj8'+_Q, _P+'2SpmmonhpN8'+_Q, _P+'iqLnrFnGjGA'+_Q,
    _P+'Y9pFfA4Z3g0'+_Q, _P+'ME1c7ue37Uc'+_Q, _P+'baWq4khUxXY'+_Q,
    _P+'Hcdx1zVQJ6Y'+_Q, _P+'vlx0BwZlUXQ'+_Q, _P+'Mp2AO_bR8Bk'+_Q,
    _P+'P9EtfRvrDrU'+_Q, _P+'i9TGriScRD8'+_Q, _P+'4l4mBtIQjJE'+_Q,
    _P+'LEh4UApKypU'+_Q, _P+'R0QqSK9wkFU'+_Q, _P+'cJ604-Mb5qA'+_Q,
  ],
  yakitori: [
    _P+'z4MYbjYb5p0'+_Q, _P+'KDpX7xReiTA'+_Q, _P+'5Q4UYvxDPVU'+_Q,
    _P+'L57f63Hlldw'+_Q, _P+'3F37jPyjoh4'+_Q, _P+'TURS5_0Lq4k'+_Q,
    _P+'0Vcxz3-Ncl8'+_Q, _P+'wklODYfFvmg'+_Q, _P+'YRzmSMMv8WE'+_Q,
    _P+'LQeavijwPBA'+_Q, _P+'DNL8laMYN1k'+_Q, _P+'t8GpZPPJkLk'+_Q,
    _P+'c22X4t4S4AM'+_Q, _P+'c4G4n66Gpv4'+_Q, _P+'Et5Q49kBYNE'+_Q,
  ],
  chinese: [
    _P+'qwkJikR68Lg'+_Q, _P+'cT3Hyyd2lvc'+_Q, _P+'gud5uyDhIBY'+_Q,
    _P+'TUT3GoN3Doc'+_Q, _P+'92m3rmB9sBk'+_Q, _P+'63v7QEQss8E'+_Q,
    _P+'idUSfFfqLmw'+_Q, _P+'c7SdPgdN5bs'+_Q, _P+'bfEGC4YivMY'+_Q,
    _P+'bB1asxTdgqY'+_Q, _P+'MBIuvUxLsrc'+_Q, _P+'rYm4o6_5qCQ'+_Q,
    _P+'93Zqhki1SiI'+_Q, _P+'c0rG-tU6mdU'+_Q, _P+'ZD-DQ37hb6c'+_Q,
  ],
  pasta: [
    _P+'tabk4yubPRo'+_Q, _P+'c9jslw1cW2k'+_Q, _P+'XbJAAqFb2kk'+_Q,
    _P+'do_0q9ohxx4'+_Q, _P+'vm0o0tvJm40'+_Q, _P+'kEx2HcGEMQw'+_Q,
    _P+'k8FXgsDTm8g'+_Q, _P+'OC3lZI9P6kU'+_Q, _P+'96_YK8b9wCc'+_Q,
    _P+'ycPasxXvN_0'+_Q, _P+'8qoQvkySugg'+_Q, _P+'AUUo1nQL-Mo'+_Q,
    _P+'JR7yVg2NgQI'+_Q, _P+'fzWWN44yN_w'+_Q, _P+'zkNYXr0_PqQ'+_Q,
  ],
  burger: [
    _P+'NERTiaUm1XQ'+_Q, _P+'SuStMDMym6M'+_Q, _P+'knraRhF5aKA'+_Q,
    _P+'_RkULUk5ss8'+_Q, _P+'wns2fRY-3PQ'+_Q, _P+'FqswrKAgA2Y'+_Q,
    _P+'xUYf8bQt5e8'+_Q, _P+'tT8q7JrG5pQ'+_Q, _P+'jcNgF3g8_uM'+_Q,
    _P+'FTQJBGDxKXg'+_Q, _P+'IB__k0z3XtQ'+_Q, _P+'Ach7cC5wB7M'+_Q,
    _P+'3sF8q0HeKek'+_Q, _P+'88YAXjnpvrM'+_Q, _P+'spHlQKCLuAI'+_Q,
  ],
  pizza: [
    _P+'vXpbb_jmYGY'+_Q, _P+'tnkIIePNKeI'+_Q, _P+'HGPlnmepMAA'+_Q,
    _P+'WNYDvEwNvAk'+_Q, _P+'wiCEuDu3UYU'+_Q, _P+'j0vRUNCKmQc'+_Q,
    _P+'Tg5sYkG99eE'+_Q, _P+'xR5E5yKfDUU'+_Q, _P+'e_sPGrutbwY'+_Q,
    _P+'Grgs988eWH0'+_Q, _P+'70sgoUBJ_as'+_Q, _P+'w1iMfs6yxuo'+_Q,
    _P+'ALFaT8aMx7A'+_Q, _P+'W6jVwPBz-kw'+_Q, _P+'BjSakjrXOY4'+_Q,
  ],
};
