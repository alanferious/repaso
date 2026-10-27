// Verb list + conjugation engine for the ab initio tenses.
//
// Each verb: inf, en ("base,3rd person,past,past participle,-ing|extra words"), g (group)
// Optional irregularities:
//   sc     stem change in the present: "ie" | "ue" | "i" | "u-ue" (jugar)
//   yo     irregular present "yo" form (tengo, hago...) – also drives the subjunctive
//   pres   full present override          impf  full imperfect override
//   pret   { stem } strong preterite stem, { full } full override, { patch } single forms
//   fut    future/conditional stem         pp    past participle     ger  gerund
//   imp    tú imperative                   subj  full subjunctive override
//   noImp  leave out of imperative drills

const PERSONS = ["yo", "tú", "él / ella / usted", "nosotros", "vosotros", "ellos / ellas / ustedes"];
const EN_SUBJ = ["I", "you", "he/she", "we", "you (pl.)", "they"];
const REFL = ["me", "te", "se", "nos", "os", "se"];

const GROUPS = [
  { id: "ar", name: "Regular -ar" },
  { id: "er", name: "Regular -er" },
  { id: "ir", name: "Regular -ir" },
  { id: "stem", name: "Stem-changing" },
  { id: "irreg", name: "Irregular" },
  { id: "refl", name: "Reflexive" },
];

const VERBS = [
  // regular -ar
  { inf: "hablar", en: "speak,speaks,spoke,spoken,speaking", g: "ar" },
  { inf: "trabajar", en: "work,works,worked,worked,working", g: "ar" },
  { inf: "estudiar", en: "study,studies,studied,studied,studying", g: "ar" },
  { inf: "escuchar", en: "listen,listens,listened,listened,listening", g: "ar" },
  { inf: "mirar", en: "watch,watches,watched,watched,watching", g: "ar" },
  { inf: "comprar", en: "buy,buys,bought,bought,buying", g: "ar" },
  { inf: "viajar", en: "travel,travels,travelled,travelled,travelling", g: "ar" },
  { inf: "visitar", en: "visit,visits,visited,visited,visiting", g: "ar" },
  { inf: "llegar", en: "arrive,arrives,arrived,arrived,arriving", g: "ar" },
  { inf: "buscar", en: "look,looks,looked,looked,looking|for", g: "ar" },
  { inf: "tocar", en: "play,plays,played,played,playing|[an instrument]", g: "ar" },
  { inf: "practicar", en: "practise,practises,practised,practised,practising", g: "ar" },
  { inf: "sacar", en: "take,takes,took,taken,taking|out", g: "ar" },
  { inf: "pagar", en: "pay,pays,paid,paid,paying", g: "ar" },
  { inf: "cocinar", en: "cook,cooks,cooked,cooked,cooking", g: "ar" },
  { inf: "bailar", en: "dance,dances,danced,danced,dancing", g: "ar" },
  { inf: "cantar", en: "sing,sings,sang,sung,singing", g: "ar" },
  { inf: "nadar", en: "swim,swims,swam,swum,swimming", g: "ar" },
  { inf: "tomar", en: "take,takes,took,taken,taking|[or drink]", g: "ar" },
  { inf: "ayudar", en: "help,helps,helped,helped,helping", g: "ar" },
  { inf: "llevar", en: "wear,wears,wore,worn,wearing|[or carry]", g: "ar" },
  { inf: "necesitar", en: "need,needs,needed,needed,needing", g: "ar" },
  { inf: "descansar", en: "rest,rests,rested,rested,resting", g: "ar" },
  { inf: "reciclar", en: "recycle,recycles,recycled,recycled,recycling", g: "ar" },
  { inf: "terminar", en: "finish,finishes,finished,finished,finishing", g: "ar" },
  { inf: "ganar", en: "win,wins,won,won,winning|[or earn]", g: "ar" },
  { inf: "desayunar", en: "have,has,had,had,having|breakfast", g: "ar" },
  { inf: "cenar", en: "have,has,had,had,having|dinner", g: "ar" },

  // regular -er
  { inf: "comer", en: "eat,eats,ate,eaten,eating", g: "er" },
  { inf: "beber", en: "drink,drinks,drank,drunk,drinking", g: "er" },
  { inf: "aprender", en: "learn,learns,learnt,learnt,learning", g: "er" },
  { inf: "correr", en: "run,runs,ran,run,running", g: "er" },
  { inf: "vender", en: "sell,sells,sold,sold,selling", g: "er" },
  { inf: "comprender", en: "understand,understands,understood,understood,understanding", g: "er" },
  { inf: "deber", en: "have,has,had,had,having|to", g: "er", noImp: true },
  { inf: "romper", en: "break,breaks,broke,broken,breaking", g: "er", pp: "roto" },
  { inf: "leer", en: "read,reads,read,read,reading", g: "er",
    pret: { full: ["leí", "leíste", "leyó", "leímos", "leísteis", "leyeron"] } },
  { inf: "creer", en: "believe,believes,believed,believed,believing", g: "er",
    pret: { full: ["creí", "creíste", "creyó", "creímos", "creísteis", "creyeron"] } },

  // regular -ir
  { inf: "vivir", en: "live,lives,lived,lived,living", g: "ir" },
  { inf: "escribir", en: "write,writes,wrote,written,writing", g: "ir", pp: "escrito" },
  { inf: "abrir", en: "open,opens,opened,opened,opening", g: "ir", pp: "abierto" },
  { inf: "compartir", en: "share,shares,shared,shared,sharing", g: "ir" },
  { inf: "recibir", en: "receive,receives,received,received,receiving", g: "ir" },
  { inf: "decidir", en: "decide,decides,decided,decided,deciding", g: "ir" },
  { inf: "subir", en: "go,goes,went,gone,going|up", g: "ir" },
  { inf: "describir", en: "describe,describes,described,described,describing", g: "ir", pp: "descrito" },
  { inf: "descubrir", en: "discover,discovers,discovered,discovered,discovering", g: "ir", pp: "descubierto" },

  // stem-changing
  { inf: "pensar", en: "think,thinks,thought,thought,thinking", g: "stem", sc: "ie" },
  { inf: "empezar", en: "start,starts,started,started,starting", g: "stem", sc: "ie" },
  { inf: "cerrar", en: "close,closes,closed,closed,closing", g: "stem", sc: "ie" },
  { inf: "entender", en: "understand,understands,understood,understood,understanding", g: "stem", sc: "ie" },
  { inf: "preferir", en: "prefer,prefers,preferred,preferred,preferring", g: "stem", sc: "ie" },
  { inf: "querer", en: "want,wants,wanted,wanted,wanting", g: "stem", sc: "ie", pret: { stem: "quis" }, fut: "querr", noImp: true },
  { inf: "volver", en: "return,returns,returned,returned,returning", g: "stem", sc: "ue", pp: "vuelto" },
  { inf: "poder", en: "be,is,was,been,being|able to", g: "stem", sc: "ue", pret: { stem: "pud" }, fut: "podr", ger: "pudiendo", noImp: true },
  { inf: "dormir", en: "sleep,sleeps,slept,slept,sleeping", g: "stem", sc: "ue" },
  { inf: "encontrar", en: "find,finds,found,found,finding", g: "stem", sc: "ue" },
  { inf: "recordar", en: "remember,remembers,remembered,remembered,remembering", g: "stem", sc: "ue" },
  { inf: "almorzar", en: "have,has,had,had,having|lunch", g: "stem", sc: "ue" },
  { inf: "morir", en: "die,dies,died,died,dying", g: "stem", sc: "ue", pp: "muerto", noImp: true },
  { inf: "jugar", en: "play,plays,played,played,playing|[a sport or game]", g: "stem", sc: "u-ue" },
  { inf: "pedir", en: "ask,asks,asked,asked,asking|for", g: "stem", sc: "i" },
  { inf: "servir", en: "serve,serves,served,served,serving", g: "stem", sc: "i" },
  { inf: "repetir", en: "repeat,repeats,repeated,repeated,repeating", g: "stem", sc: "i" },

  // irregular
  { inf: "ser", en: "be,is,was,been,being|[permanent]", g: "irreg",
    pres: ["soy", "eres", "es", "somos", "sois", "son"],
    pret: { full: ["fui", "fuiste", "fue", "fuimos", "fuisteis", "fueron"] },
    impf: ["era", "eras", "era", "éramos", "erais", "eran"],
    imp: "sé", subj: ["sea", "seas", "sea", "seamos", "seáis", "sean"] },
  { inf: "estar", en: "be,is,was,been,being|[temporary or location]", g: "irreg",
    pres: ["estoy", "estás", "está", "estamos", "estáis", "están"],
    pret: { stem: "estuv" },
    subj: ["esté", "estés", "esté", "estemos", "estéis", "estén"] },
  { inf: "ir", en: "go,goes,went,gone,going", g: "irreg",
    pres: ["voy", "vas", "va", "vamos", "vais", "van"],
    pret: { full: ["fui", "fuiste", "fue", "fuimos", "fuisteis", "fueron"] },
    impf: ["iba", "ibas", "iba", "íbamos", "ibais", "iban"],
    ger: "yendo", imp: "ve", subj: ["vaya", "vayas", "vaya", "vayamos", "vayáis", "vayan"] },
  { inf: "tener", en: "have,has,had,had,having", g: "irreg", sc: "ie", yo: "tengo",
    pret: { stem: "tuv" }, fut: "tendr", imp: "ten" },
  { inf: "hacer", en: "do,does,did,done,doing|[or make]", g: "irreg", yo: "hago",
    pret: { stem: "hic", patch: { 2: "hizo" } }, fut: "har", pp: "hecho", imp: "haz" },
  { inf: "decir", en: "say,says,said,said,saying", g: "irreg", sc: "i", yo: "digo",
    pret: { stem: "dij" }, fut: "dir", pp: "dicho", imp: "di" },
  { inf: "venir", en: "come,comes,came,come,coming", g: "irreg", sc: "ie", yo: "vengo",
    pret: { stem: "vin" }, fut: "vendr", imp: "ven" },
  { inf: "poner", en: "put,puts,put,put,putting", g: "irreg", yo: "pongo",
    pret: { stem: "pus" }, fut: "pondr", pp: "puesto", imp: "pon" },
  { inf: "salir", en: "go,goes,went,gone,going|out", g: "irreg", yo: "salgo", fut: "saldr", imp: "sal" },
  { inf: "saber", en: "know,knows,knew,known,knowing|[facts]", g: "irreg", yo: "sé",
    pret: { stem: "sup" }, fut: "sabr", subj: ["sepa", "sepas", "sepa", "sepamos", "sepáis", "sepan"] },
  { inf: "conocer", en: "know,knows,knew,known,knowing|[people or places]", g: "irreg", yo: "conozco" },
  { inf: "dar", en: "give,gives,gave,given,giving", g: "irreg",
    pres: ["doy", "das", "da", "damos", "dais", "dan"],
    pret: { full: ["di", "diste", "dio", "dimos", "disteis", "dieron"] },
    subj: ["dé", "des", "dé", "demos", "deis", "den"] },
  { inf: "ver", en: "see,sees,saw,seen,seeing", g: "irreg",
    pres: ["veo", "ves", "ve", "vemos", "veis", "ven"],
    pret: { full: ["vi", "viste", "vio", "vimos", "visteis", "vieron"] },
    impf: ["veía", "veías", "veía", "veíamos", "veíais", "veían"], pp: "visto" },
  { inf: "oír", en: "hear,hears,heard,heard,hearing", g: "irreg",
    pres: ["oigo", "oyes", "oye", "oímos", "oís", "oyen"],
    pret: { full: ["oí", "oíste", "oyó", "oímos", "oísteis", "oyeron"] } },
  { inf: "traer", en: "bring,brings,brought,brought,bringing", g: "irreg", yo: "traigo", pret: { stem: "traj" } },
  { inf: "conducir", en: "drive,drives,drove,driven,driving", g: "irreg", yo: "conduzco", pret: { stem: "conduj" } },

  // reflexive
  { inf: "levantarse", en: "get,gets,got,got,getting|up", g: "refl" },
  { inf: "ducharse", en: "have,has,had,had,having|a shower", g: "refl" },
  { inf: "lavarse", en: "wash,washes,washed,washed,washing|[oneself]", g: "refl" },
  { inf: "bañarse", en: "have,has,had,had,having|a bath", g: "refl" },
  { inf: "peinarse", en: "comb,combs,combed,combed,combing|[one's hair]", g: "refl" },
  { inf: "llamarse", en: "be,is,was,been,being|called", g: "refl", noImp: true },
  { inf: "quedarse", en: "stay,stays,stayed,stayed,staying", g: "refl" },
  { inf: "relajarse", en: "relax,relaxes,relaxed,relaxed,relaxing", g: "refl" },
  { inf: "aburrirse", en: "get,gets,got,got,getting|bored", g: "refl", noImp: true },
  { inf: "despertarse", en: "wake,wakes,woke,woken,waking|up", g: "refl", sc: "ie" },
  { inf: "acostarse", en: "go,goes,went,gone,going|to bed", g: "refl", sc: "ue" },
  { inf: "vestirse", en: "get,gets,got,got,getting|dressed", g: "refl", sc: "i" },
  { inf: "divertirse", en: "have,has,had,had,having|fun", g: "refl", sc: "ie" },
  { inf: "sentirse", en: "feel,feels,felt,felt,feeling", g: "refl", sc: "ie", noImp: true },
];

const TENSES = [
  { key: "present", name: "Presente", en: "Present" },
  { key: "preterite", name: "Pretérito indefinido", en: "Preterite" },
  { key: "imperfect", name: "Pretérito imperfecto", en: "Imperfect" },
  { key: "nearfuture", name: "Futuro próximo", en: "Near future (ir a)" },
  { key: "future", name: "Futuro simple", en: "Simple future" },
  { key: "conditional", name: "Condicional", en: "Conditional" },
  { key: "perfect", name: "Pretérito perfecto", en: "Present perfect" },
  { key: "progressive", name: "Presente continuo", en: "Present continuous" },
  { key: "imperative", name: "Imperativo (tú)", en: "Imperative (tú)" },
  { key: "subjunctive", name: "Presente de subjuntivo", en: "Present subjunctive", stretch: true },
];

const VerbEngine = (() => {
  const HABER = ["he", "has", "ha", "hemos", "habéis", "han"];
  const IR = ["voy", "vas", "va", "vamos", "vais", "van"];
  const ESTAR = ["estoy", "estás", "está", "estamos", "estáis", "están"];
  const BOOT = [0, 1, 2, 5];

  const replaceLast = (s, ch, rep) => {
    const i = s.lastIndexOf(ch);
    return i < 0 ? s : s.slice(0, i) + rep + s.slice(i + 1);
  };
  const stemChange = (stem, sc) =>
    sc === "ie" ? replaceLast(stem, "e", "ie")
    : sc === "ue" ? replaceLast(stem, "o", "ue")
    : sc === "u-ue" ? replaceLast(stem, "u", "ue")
    : sc === "i" ? replaceLast(stem, "e", "i") : stem;
  // -ir stem-changers: él/ellos preterite, gerund, nosotros/vosotros subjunctive
  const irChange = (stem, sc) =>
    sc === "ue" ? replaceLast(stem, "o", "u") : (sc === "ie" || sc === "i") ? replaceLast(stem, "e", "i") : stem;
  const unaccent = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").normalize("NFC");
  // -car/-gar/-zar spelling changes before e
  const spell = (s) => s.replace(/c$/, "qu").replace(/g$/, "gu").replace(/z$/, "c");

  function parts(v) {
    let inf = v.inf, refl = false;
    if (/(ar|er|ir|ír)se$/.test(inf)) { refl = true; inf = inf.slice(0, -2); }
    const type = inf.endsWith("ar") ? "ar" : inf.endsWith("er") ? "er" : "ir";
    return { inf, refl, type, stem: inf.slice(0, -2) };
  }

  function present(v) {
    if (v.pres) return v.pres;
    const { type, stem } = parts(v);
    const E = { ar: ["o", "as", "a", "amos", "áis", "an"], er: ["o", "es", "e", "emos", "éis", "en"], ir: ["o", "es", "e", "imos", "ís", "en"] }[type];
    return E.map((e, i) => {
      if (i === 0 && v.yo) return v.yo;
      return (v.sc && BOOT.includes(i) ? stemChange(stem, v.sc) : stem) + e;
    });
  }

  function preterite(v) {
    const p = v.pret || {};
    if (p.full) return p.full;
    if (p.stem) {
      const s = p.stem;
      const f = ["e", "iste", "o", "imos", "isteis", s.endsWith("j") ? "eron" : "ieron"].map((e) => s + e);
      if (p.patch) for (const k in p.patch) f[k] = p.patch[k];
      return f;
    }
    const { type, stem } = parts(v);
    if (type === "ar") return [spell(stem) + "é", stem + "aste", stem + "ó", stem + "amos", stem + "asteis", stem + "aron"];
    const s3 = type === "ir" && v.sc ? irChange(stem, v.sc) : stem;
    return [stem + "í", stem + "iste", s3 + "ió", stem + "imos", stem + "isteis", s3 + "ieron"];
  }

  function imperfect(v) {
    if (v.impf) return v.impf;
    const { type, stem } = parts(v);
    const E = type === "ar" ? ["aba", "abas", "aba", "ábamos", "abais", "aban"] : ["ía", "ías", "ía", "íamos", "íais", "ían"];
    return E.map((e) => stem + e);
  }

  const futStem = (v) => v.fut || unaccent(parts(v).inf);
  const future = (v) => ["é", "ás", "á", "emos", "éis", "án"].map((e) => futStem(v) + e);
  const conditional = (v) => ["ía", "ías", "ía", "íamos", "íais", "ían"].map((e) => futStem(v) + e);

  function participle(v) {
    if (v.pp) return v.pp;
    const { type, stem } = parts(v);
    if (type === "ar") return stem + "ado";
    return /[aeo]$/.test(stem) ? stem + "ído" : stem + "ido";
  }

  function gerund(v) {
    if (v.ger) return v.ger;
    const { type, stem } = parts(v);
    if (type === "ar") return stem + "ando";
    if (/[aeo]$/.test(stem)) return stem + "yendo";
    return (type === "ir" && v.sc ? irChange(stem, v.sc) : stem) + "iendo";
  }

  function subjunctive(v) {
    if (v.subj) return v.subj;
    const { type, stem } = parts(v);
    const E = type === "ar" ? ["e", "es", "e", "emos", "éis", "en"] : ["a", "as", "a", "amos", "áis", "an"];
    const fix = (s) => (type === "ar" ? spell(s) : s);
    if (v.yo || v.pres) {
      const ys = present(v)[0].replace(/o$/, "");
      return E.map((e) => fix(ys) + e);
    }
    const boot = v.sc ? stemChange(stem, v.sc) : stem;
    const nv = type === "ir" && v.sc ? irChange(stem, v.sc) : stem;
    return E.map((e, i) => fix(i === 3 || i === 4 ? nv : boot) + e);
  }

  // Put the written accent on the stressed (penultimate) syllable when a
  // pronoun is attached: levanta + te -> levántate, duchando + me -> duchándome
  function attach(word, pron) {
    if (/[áéíóú]/.test(word)) return word + pron;
    const nuclei = [];
    const re = /[aeiouü]+/g;
    let m;
    while ((m = re.exec(word))) {
      // two strong vowels side by side are separate syllables
      let start = m.index, s = m[0];
      for (let k = 1; k < s.length; k++) {
        if ("aeo".includes(s[k]) && "aeo".includes(s[k - 1])) {
          nuclei.push({ i: start, s: s.slice(0, k) });
          start += k; s = s.slice(k); k = 0;
        }
      }
      nuclei.push({ i: start, s });
    }
    if (nuclei.length < 2) return word + pron;
    const n = nuclei[nuclei.length - 2];
    let off = [...n.s].findIndex((c) => "aeo".includes(c));
    if (off < 0) off = n.s.length - 1;
    const pos = n.i + off;
    const acc = { a: "á", e: "é", i: "í", o: "ó", u: "ú" }[word[pos]];
    return word.slice(0, pos) + acc + word.slice(pos + 1) + pron;
  }

  // Accepted answers for one person in one tense (first = model answer)
  function forms(v, tense, i) {
    const P = parts(v);
    const r = REFL[i];
    const simple = (f) => [P.refl ? `${r} ${f}` : f];
    switch (tense) {
      case "present": return simple(present(v)[i]);
      case "preterite": return simple(preterite(v)[i]);
      case "imperfect": return simple(imperfect(v)[i]);
      case "future": return simple(future(v)[i]);
      case "conditional": return simple(conditional(v)[i]);
      case "subjunctive": return simple(subjunctive(v)[i]);
      case "perfect": return simple(`${HABER[i]} ${participle(v)}`);
      case "nearfuture":
        return P.refl ? [`${r} ${IR[i]} a ${P.inf}`, `${IR[i]} a ${P.inf}${r}`] : [`${IR[i]} a ${P.inf}`];
      case "progressive":
        return P.refl ? [`${r} ${ESTAR[i]} ${gerund(v)}`, `${ESTAR[i]} ${attach(gerund(v), r)}`] : [`${ESTAR[i]} ${gerund(v)}`];
      case "imperative": {
        const f = v.imp || present(v)[2];
        return [P.refl ? attach(f, "te") : f];
      }
    }
    return [];
  }

  function english(v, tense, i) {
    const [main, rest = ""] = v.en.split("|");
    const [b, s, past, pp, ing] = main.split(",");
    const sub = EN_SUBJ[i];
    const be = b === "be";
    const BE = ["am", "are", "is", "are", "are", "are"];
    const WAS = ["was", "were", "was", "were", "were", "were"];
    const R = rest ? " " + rest : "";
    switch (tense) {
      case "present": return `${sub} ${be ? BE[i] : i === 2 ? s : b}${R}`;
      case "preterite": return `${sub} ${be ? WAS[i] : past}${R}`;
      case "imperfect": return `${sub} used to ${b}${R}`;
      case "future": return `${sub} will ${b}${R}`;
      case "conditional": return `${sub} would ${b}${R}`;
      case "perfect": return `${sub} ${i === 2 ? "has" : "have"} ${pp}${R}`;
      case "nearfuture": return `${sub} ${BE[i]} going to ${b}${R}`;
      case "progressive": return `${sub} ${BE[i]} ${ing}${R}`;
      case "imperative": return `${b[0].toUpperCase() + b.slice(1)}${R}! (tú)`;
      case "subjunctive": return `(that) ${sub} ${b}${R}`;
    }
    return "";
  }

  const personsFor = (tense, vosotros) =>
    tense === "imperative" ? [1] : [0, 1, 2, 3, 4, 5].filter((i) => vosotros || i !== 4);

  return { forms, english, personsFor, parts };
})();

// Short reference notes shown in the Tense guide
const GUIDE = {
  present: {
    use: "Habits, routines, facts and what is happening now.",
    markers: "normalmente, siempre, todos los días, a veces, cada semana, ahora",
    endings: { ar: "o, as, a, amos, áis, an", er: "o, es, e, emos, éis, en", ir: "o, es, e, imos, ís, en" },
    watch: [
      "Stem-changing (boot) verbs change in every form except nosotros/vosotros: pienso, puedo, pido, juego.",
      "Irregular yo forms: tengo, hago, pongo, salgo, vengo, digo, traigo, conozco, conduzco, sé, doy, veo, oigo.",
      "Fully irregular: soy, estoy, voy.",
    ],
    examples: ["Normalmente me levanto a las siete.", "Vivo en un piso en el centro de la ciudad."],
  },
  preterite: {
    use: "Completed actions at a specific moment in the past.",
    markers: "ayer, anoche, la semana pasada, el año pasado, hace dos años, un día, de repente",
    endings: { ar: "é, aste, ó, amos, asteis, aron", er: "í, iste, ió, imos, isteis, ieron", ir: "í, iste, ió, imos, isteis, ieron" },
    watch: [
      "ser and ir are identical: fui, fuiste, fue, fuimos, fuisteis, fueron.",
      "Strong stems take e, iste, o, imos, isteis, ieron (no accents): tuve, estuve, pude, puse, quise, supe, vine, hice (hizo).",
      "j-stems drop the i in ellos: dijeron, trajeron, condujeron.",
      "Spelling in yo: -car → qué (busqué), -gar → gué (llegué, jugué), -zar → cé (empecé).",
      "-ir stem-changers change in él/ellos: pidió, durmió, prefirieron.",
      "dar and ver have no accents: di, dio, vi, vio.",
    ],
    examples: ["El verano pasado fui a México con mi familia.", "Ayer comí paella y después jugué al fútbol."],
  },
  imperfect: {
    use: "Descriptions in the past, what used to happen, and background (what was going on).",
    markers: "cuando era pequeño/a, de niño/a, antes, siempre, todos los días, mientras",
    endings: { ar: "aba, abas, aba, ábamos, abais, aban", er: "ía, ías, ía, íamos, íais, ían", ir: "ía, ías, ía, íamos, íais, ían" },
    watch: ["Only three irregulars: ser (era), ir (iba), ver (veía).", "Pair it with the preterite: background (imperfect) + event (preterite)."],
    examples: ["Cuando era pequeña, vivía en Madrid.", "Hacía sol y había mucha gente en la playa."],
  },
  nearfuture: {
    use: "Plans and things that are going to happen.",
    markers: "mañana, esta tarde, este fin de semana, la semana que viene",
    endings: { all: "ir (voy, vas, va, vamos, vais, van) + a + infinitive" },
    watch: ["Reflexive pronoun goes before ir or on the end of the infinitive: me voy a duchar = voy a ducharme."],
    examples: ["Voy a estudiar medicina en la universidad.", "Este sábado vamos a celebrar el cumpleaños de mi abuela."],
  },
  future: {
    use: "What will happen; predictions and ambitions.",
    markers: "en el futuro, algún día, dentro de diez años, el año que viene",
    endings: { all: "infinitive + é, ás, á, emos, éis, án" },
    watch: ["Irregular stems: tendr-, vendr-, pondr-, saldr-, podr-, sabr-, querr-, har-, dir-, habr- (habrá = there will be)."],
    examples: ["En el futuro viviré en el extranjero.", "Dentro de diez años tendré mi propia empresa."],
  },
  conditional: {
    use: "What would happen; polite requests; wishes (me gustaría).",
    markers: "me gustaría, sería, en un mundo ideal, si pudiera…",
    endings: { all: "infinitive + ía, ías, ía, íamos, íais, ían" },
    watch: ["Same irregular stems as the future: tendría, haría, podría, diría, saldría."],
    examples: ["Me gustaría trabajar como médico.", "Sería genial tener más zonas verdes en mi barrio."],
  },
  perfect: {
    use: "What has happened (recently or ever), linked to the present.",
    markers: "hoy, esta semana, este año, alguna vez, nunca, ya, todavía no",
    endings: { all: "haber (he, has, ha, hemos, habéis, han) + past participle (-ado / -ido)" },
    watch: [
      "Irregular participles: hecho, dicho, escrito, visto, vuelto, puesto, abierto, roto, muerto, descubierto.",
      "Accent after a vowel: leído, creído, oído, traído.",
      "Pronouns go before haber: me he levantado.",
    ],
    examples: ["¿Has visitado España alguna vez?", "Nunca he comido pulpo."],
  },
  progressive: {
    use: "What is happening right now.",
    markers: "ahora, en este momento",
    endings: { all: "estar (estoy, estás, está, estamos, estáis, están) + gerund (-ando / -iendo)" },
    watch: [
      "Gerunds: leyendo, oyendo, trayendo, yendo; -ir stem-changers: durmiendo, pidiendo, diciendo, viniendo.",
      "Reflexive: me estoy duchando = estoy duchándome (note the accent).",
    ],
    examples: ["Estoy haciendo los deberes.", "Mis padres están viendo la tele."],
  },
  imperative: {
    use: "Telling a friend (tú) what to do.",
    markers: "instructions, advice, recipes, directions",
    endings: { all: "same as the él/ella present form: habla, come, escribe" },
    watch: [
      "Irregular: di, haz, ve, pon, sal, sé, ten, ven.",
      "Pronouns attach to the end, with an accent: levántate, siéntate, dúchate.",
      "Negative commands use the subjunctive: no hables, no comas.",
    ],
    examples: ["¡Escucha bien!", "Gira a la derecha y sigue todo recto."],
  },
  subjunctive: {
    use: "Stretch: wishes, advice and future ‘when’ clauses. Learn it in set phrases.",
    markers: "espero que, quiero que, es importante que, ojalá, para que, cuando (+ future meaning)",
    endings: { ar: "yo form minus -o + e, es, e, emos, éis, en", er: "yo form minus -o + a, as, a, amos, áis, an", ir: "yo form minus -o + a, as, a, amos, áis, an" },
    watch: [
      "Irregulars: sea, esté, vaya, sepa, dé, haya.",
      "Built from the yo form, so tengo → tenga, hago → haga, conozco → conozca.",
    ],
    examples: ["Cuando sea mayor, quiero ser abogada.", "Espero que haga buen tiempo mañana."],
  },
};
