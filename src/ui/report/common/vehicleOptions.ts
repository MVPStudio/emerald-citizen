// export const VEHICLE_COLOR_OPTIONS = [
// 	{ value: 'blue', label: 'Blue' },
// 	{ value: 'red', label: 'Red' },
// 	{ value: 'yellow', label: 'Yellow' }
// ]

export const VEHICLE_COLOR_OPTIONS = [
	'blue',
	'red',
	'yellow'
].sort();

export const VEHICLE_MAKES_MODELS: Record<string, string[]> = {
	'Other': [
		'Other'
	],
	'Chrysler': [
		'300',
		'pt cruiser',
		'crossfire',
		'voyager',
		'town and country',
		'300C',
		'sebring',
		'LeBaron',
		'pacifica',
		'cirrus',
		'concorde',
		'180',
		'200'
	],
	'Dodge': [
		'avenger',
		'caliber',
		'challenger',
		'charger',
		'colt',
		'dart',
		'Intrepid',
		'magnum',
		'neon',
		'shadow',
		'stealth',
		'stratus',
		'spirit',
		'stratus',
		'viper'
	],
	'Jeep': [
		'cherokee',
		'grand cherokee',
		'compass',
		'wrangler',
		'patiort',
		'liberty',
		'commander',
		'wagoneer',
		'commander'
	],
	'Ford': [
		'fiesta',
		'focus',
		'fusion',
		'taurus',
		'fiesta',
		'mustang',
		'b-max',
		'c-max',
		's-max',
		'galaxy',
		'ecosport',
		'flex',
		'edge',
		'explorer',
		'expedition',
		'ranger',
		'f-150',
		'f-250',
		'f-350',
		'ranger',
		'contour',
		'escort',
		'mondeo',
		'bronco',
		'excursion',
		'flex'
	],
	'Lincoln': [
		'MKZ',
		'continental',
		'MKC',
		'MKT',
		'MKX',
		'navigator',
		'town car',
		'LS',
		'aviator',
		'zephyr',
		'MKS'
	],
	'Buick': [
		'LaCross',
		'regal',
		'encore',
		'envision',
		'enclave',
		'century',
		'excelle',
		'LeSabre',
		'Lucerne',
		'park avenue',
		'roadmaster',
		'rendezvous',
		'rainier',
		'skylark',
		'terraza'
	],
	'Cadillac': [
		'ATS',
		'CTS',
		'XTS',
		'CT6',
		'XT5',
		'escalade'
	],
	'Chevrolet': [
		'spark',
		'sonic',
		'bolt',
		'volt',
		'cruze',
		'malibu',
		'impala',
		'SS',
		'caprice',
		'camaro',
		'corvette',
		'express',
		'trax',
		'equinox',
		'traverse',
		'tahoe',
		'suburban',
		'colorado',
		'silverado',
		'lumina',
		'cavalier',
		'CMP',
		'CMV',
		'cobalt',
		'corsa',
		'montana',
		'monte carlo'
	],
	'GMC': [
		'sonoma',
		'sierra',
		'canyon',
		'suburban',
		'yukon',
		'envoy',
		'acadia',
		'terrain'
	],
	'Tesla': [
		'model s',
		'model x',
		'model 3'
	],
	'Pontiac': [
		'aztek',
		'bonneville',
		'firebird',
		'g2',
		'g3',
		'g4',
		'g5',
		'g6',
		'grand am',
		'grand prix',
		'GTO',
		'montana',
		'solstice',
		'sunbird',
		'sunfire',
		'torrent',
		'trans-am',
		'vibe',
		'wave'
	],
	'Toyota': [
		'4Runner',
		'avalon',
		'camry',
		'century',
		'highlander',
		'land cruiser',
		'prius',
		'sequoia',
		'sienna',
		'tacoma',
		'tundra',
		'yaris',
		'corolla',
		'rav4',
		'venza',
		'verossa',
		'vista',
		'pickup'
	],
	'Lexus': [
		'CT',
		'IS',
		'HS',
		'ES',
		'GS',
		'LS',
		'SC',
		'RC',
		'LC',
		'LFA',
		'NX',
		'RX',
		'GX',
		'LX'
	],
	'Acura': [
		'TSX',
		'MDX',
		'integra',
		'RL',
		'TL',
		'RDX',
		'CL',
		'CSX',
		'EL',
		'legend',
		'ZDX',
		'NSX',
		'CDX',
		'vigor'
	],
	'Nissan': [
		'skyline',
		'maxima',
		'sentra',
		'pathfinder',
		'altima',
		'cube',
		'murano',
		'rogue',
		'versa',
		'GT-R',
		'370Z',
		'350Z',
		'leaf',
		'juke',
		'200SX',
		'xterra'
	],
	'Honda': [
		'accord',
		'civic',
		'cr-v',
		'fit',
		'legend',
		'pilot',
		'passport',
		'prelude',
		'cr-x'
	],
	'Mazda': [
		'mazda2',
		'mazda3',
		'mazda5',
		'mazda6',
		'mx-5',
		'cx-3',
		'cx-5',
		'cx-9',
		'mx-6',
		'rx-8',
		'mpv'
	],
	'Subaru': [
		'forester',
		'impreza',
		'legacy',
		'outback'
	],
	'Mitsubishi': [
		'360',
		'380',
		'500',
		'3000GT',
		'outlander',
		'lancer',
		'galant',
		'lancer evolution',
		'carisma',
		'pajero',
		'eclipse',
		'endeavor',
		'magna',
		'ek',
		'diamante',
		'GTO',
		'freeca',
		'FTO',
		'mirage',
		'challenger'
	],
	'kia': [
		'forte',
		'optima',
		'soul',
		'sorento',
		'sportage',
		'spectra',
		'pride',
		'sephia'
	],
	'hyundai': [
		'accent',
		'aero',
		'dynasty',
		'elantra',
		'genesis',
		'G80',
		'i10',
		'i20',
		'i30',
		'i40',
		'sante fe',
		'sonata',
		'tucson',
		'velostar',
		'veracruz'
	],
	'Isuzu': [
		'trooper',
		'wizard',
		'ascender',
		'aska',
		'amigo'
	],
	'Audi': [
		'A1',
		'A2',
		'A3',
		'A4',
		'A5',
		'A6',
		'A7',
		'A8',
		'TT',
		'Q3',
		'Q5',
		'Q7',
		'R8',
		'allroad'
	],
	'BMW': [
		'1 series',
		'2 series',
		'3 series',
		'4 series',
		'5 series',
		'6 series',
		'7 series',
		'x1',
		'x3',
		'x4',
		'x5',
		'x6',
		'z1',
		'z3',
		'z4',
		'z8',
		'i3',
		'i8'
	],
	'Mercedes': [
		'a class',
		'b class',
		'c class',
		'cl class',
		'clk class',
		'cls class',
		'e class',
		'g class',
		'gl class',
		'm class',
		'r class',
		'sl class',
		'slk class'
	],
	'Porsche': [
		'911',
		'boxster',
		'cayman',
		'cayenne',
		'panamera'
	],
	'Volkswagen': [
		'golf',
		'jetta',
		'beetle',
		'passat',
		'scirocco',
		'tiguan',
		'touareg',
		'corrado',
		'bus'
	],
	'Fiat': [
		'500',
		'panda',
		'punto',
		'freemont'
	],
	'Mini': [
		'cooper',
		'countryman',
		'clubman'
	],
	'Jaguar': [
		'f-type',
		'xe',
		'xf',
		'xj',
		's-type',
		'x-type'
	],
	'Land Rover': [
		'evoque',
		'range rover',
		'discovery',
		'freelander',
		'defender'
	]
};

// export const VEHICLE_MAKE_OPTIONS = Object.keys(VEHICLE_MAKES_MODELS)
// 	.sort()
// 	.map(model => ({ label: model, value: model }));
export const VEHICLE_MAKE_OPTIONS = Object.keys(VEHICLE_MAKES_MODELS).sort()

// export const getVehiclesModelsByMake = (make: string) => (VEHICLE_MAKES_MODELS[make] || []).sort().map(stringToOption);

export const getVehiclesModelsByMake = (make: string) => (VEHICLE_MAKES_MODELS[make] || []).sort();

function stringToOption(str: string) {
	return { label: str, value: str };
}
// 	.map(model => ({ label: model, value: model }))

// export const ALL_MODEL_OPTIONS = Object.keys(MODEL_OPTIONS)
// 	.reduce((arr, make) => arr.concat(MODEL_OPTIONS[make].map((model: any) => Object.assign({}, model, { make }))), [])
// 	.sort((a, b) => {
// 		if (a.value < b.value) { return -1; }
// 		if (a.value > b.value) { return 1; }
// 		return 0;
// 	})