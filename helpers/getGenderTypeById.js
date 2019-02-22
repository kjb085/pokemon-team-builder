const genderSpecificIds = {
    maleOnly: [
        628, // Braviary
        475, // Gallade
        107, // Hitmonchan
        106, // Hitmonlee
        237, // Hitmontop
        645, // Landorus
        381, // Latios
        414, // Mothim
        34, // Nidoking
        32, // Nidoran (male - duh)
        33, // Nidorino
        627, // Rufflet
        539, // Sawk
        128, // Tauros
        538, // Throh
        642, // Thundurus
        641, // Tornadus
        236, // Tyrouge
        313, // Volbeat
    ],
    femaleOnly: [
        242, // Blissey
        761, // Bounsweet
        113, // Chansey
        488, // Cresselia
        669, // Flabebe
        670, // Floette
        671, // Florges
        478, // Froslass
        440, // Happiny
        314, // Illumise
        124, // Jynx
        115, // Kangaskahn
        380, // Latias
        549, // Lilligant
        630, // Mandibuzz
        241, // Miltank
        31, // Nidoqueen
        29, // Nidoran (female - duh)
        30, // Nidorina
        548, // Petilil
        758, // Salazzle
        238, // Smoochum
        762, // Steenee
        763, // Tsareena
        416, // Vespiquen
        629, // Vullaby
        413, // Wormadam
    ],
    genderless: [
        493, // arceus
        144, // articuno
        482, // azelf
        343, // baltoy
        374, // beldum
        806, // blacephalon
        437, // bronzong
        436, // bronzor
        794, // buzzwole
        703, // carbink
        251, // celebi
        797, // celesteela
        344, // claydol
        638, // cobalion
        790, // cosmoem
        789, // cosmog
        615, // cryogonal
        491, // darkrai
        781, // dhelmise
        483, // dialga
        719, // diancie
        132, // ditto
        101, // electrode
        244, // entei
        649, // genesect
        622, // golett
        623, // golurk
        383, // groudon
        799, // guzzlord
        250, // 'ho-oh'
        720, // hoopa
        385, // jirachi
        798, // kartana
        600, // klang
        599, // klink
        601, // klinklang
        382, // kyogre
        646, // kyurem
        249, // lugia
        792, // lunala
        337, // lunatone
        801, // magearna
        81, // magnemite
        82, // magneton
        462, // magnezone
        490, // manaphy
        802, // marshadow
        481, // mesprit
        376, // metagross
        375, // metang
        151, // mew
        150, // mewtwo
        146, // moltres
        804, // naganadel
        800, // necrozma
        793, // nihilego
        484, // palkia
        795, // pheromosa
        489, // phione
        803, // poipole
        137, // porygon
        474, // 'porygon-z'
        233, // porygon2
        243, // raikou
        384, // rayquaza
        378, // regice
        486, // regigigas
        377, // regirock
        379, // registeel
        643, // reshiram
        479, // rotom
        292, // shedinja
        773, // silvally
        791, // solgaleo
        338, // solrock
        805, // stakataka
        121, // starmie
        120, // staryu
        245, // suicune
        787, // 'tapu-bulu'
        788, // 'tapu-fini'
        785, // 'tapu-koko'
        786, // 'tapu-lele'
        639, // terrakion
        772, // 'type-null'
        201, // unown
        480, // uxie
        494, // victini
        640, // virizion
        721, // volcanion
        100, // voltorb
        716, // xerneas
        796, // xurkitree
        717, // yveltal
        145, // zapdos
        644, // zekrom
        807, // zeraora
        718, // zygarde
        386, // deoxys
        487, // giratina
        647, // keldeo
        809, // melmetal
        648, // meloetta
        808, // meltan
        774, // minior
        492, // shaymin
    ],
};

module.exports = (id) => {
    for (var type in genderSpecificIds) {
        if (genderSpecificIds.hasOwnProperty(type)) {
            if (genderSpecificIds[type].indexOf(id) > -1) {
                return type;
            }
        }
    }

    return 'normal';
};
