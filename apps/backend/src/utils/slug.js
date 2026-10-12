// ── Ukrainian → Latin slug ────────────────────────────────────────────────────
const UK_MAP = {
    'а':'a',  'б':'b',  'в':'v',  'г':'h',  'ґ':'g',
    'д':'d',  'е':'e',  'є':'ye', 'ж':'zh', 'з':'z',
    'и':'y',  'і':'i',  'ї':'yi', 'й':'y',  'к':'k',
    'л':'l',  'м':'m',  'н':'n',  'о':'o',  'п':'p',
    'р':'r',  'с':'s',  'т':'t',  'у':'u',  'ф':'f',
    'х':'kh', 'ц':'ts', 'ч':'ch', 'ш':'sh', 'щ':'shch',
    'ь':'',   'ю':'yu', 'я':'ya',
    "'": '', '’': '', 'ʼ': '',
};

function ukrainianToSlug(text) {
    return text
        .toLowerCase()
        .split('')
        .map(c => (c in UK_MAP ? UK_MAP[c] : c))
        .join('')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 120);
}

module.exports = { ukrainianToSlug };
