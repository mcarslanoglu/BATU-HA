// ═══════════════════════════════════════════════════════════════
// INTERACTIVE HYPSOMETRIC ANALYSIS TOOL (Auto-Run Version)
// DUAL METHOD: (1) Elevation-Relief Ratio  (2) Curve Integral
// ═══════════════════════════════════════════════════════════════

ui.root.clear();

// Level option maps
var hucLevelMap = {
  'HUC 2  (Major River Basins)':  'USGS/WBD/2017/HUC02',
  'HUC 4  (Sub-basins)':          'USGS/WBD/2017/HUC04',
  'HUC 6  (Accounting Units)':    'USGS/WBD/2017/HUC06',
  'HUC 8  (Cataloging Units)':    'USGS/WBD/2017/HUC08',
  'HUC 10 (Watersheds)':          'USGS/WBD/2017/HUC10',
  'HUC 12 (Sub-watersheds)':      'USGS/WBD/2017/HUC12'
};

var hydroshedsLevelMap = {
  'Level 1  (Continental)':   'WWF/HydroSHEDS/v1/Basins/hybas_1',
  'Level 2':                  'WWF/HydroSHEDS/v1/Basins/hybas_2',
  'Level 3':                  'WWF/HydroSHEDS/v1/Basins/hybas_3',
  'Level 4':                  'WWF/HydroSHEDS/v1/Basins/hybas_4',
  'Level 5':                  'WWF/HydroSHEDS/v1/Basins/hybas_5',
  'Level 6':                  'WWF/HydroSHEDS/v1/Basins/hybas_6',
  'Level 7':                  'WWF/HydroSHEDS/v1/Basins/hybas_7',
  'Level 8':                  'WWF/HydroSHEDS/v1/Basins/hybas_8',
  'Level 9':                  'WWF/HydroSHEDS/v1/Basins/hybas_9',
  'Level 10':                 'WWF/HydroSHEDS/v1/Basins/hybas_10',
  'Level 11':                 'WWF/HydroSHEDS/v1/Basins/hybas_11',
  'Level 12':                 'WWF/HydroSHEDS/v1/Basins/hybas_12'
};

// Recommended zoom levels per dataset (coarser = zoom out more)
var hucZoomMap = {
  'HUC 2  (Major River Basins)':  3,
  'HUC 4  (Sub-basins)':          4,
  'HUC 6  (Accounting Units)':    5,
  'HUC 8  (Cataloging Units)':    5,
  'HUC 10 (Watersheds)':          6,
  'HUC 12 (Sub-watersheds)':      7
};

var hydroshedsZoomMap = {
  'Level 1  (Continental)':   2,
  'Level 2':                  3,
  'Level 3':                  3,
  'Level 4':                  4,
  'Level 5':                  4,
  'Level 6':                  5,
  'Level 7':                  5,
  'Level 8':                  6,
  'Level 9':                  6,
  'Level 10':                 7,
  'Level 11':                 7,
  'Level 12':                 8
};

// Line width per level (coarser levels = thicker so they are visible at low zoom)
var hucWidthMap = {
  'HUC 2  (Major River Basins)':  3,
  'HUC 4  (Sub-basins)':          2.5,
  'HUC 6  (Accounting Units)':    2,
  'HUC 8  (Cataloging Units)':    2,
  'HUC 10 (Watersheds)':          1.5,
  'HUC 12 (Sub-watersheds)':      1.5
};

var hydroshedsWidthMap = {
  'Level 1  (Continental)':   4,
  'Level 2':                  3.5,
  'Level 3':                  3,
  'Level 4':                  2.5,
  'Level 5':                  2.5,
  'Level 6':                  2,
  'Level 7':                  2,
  'Level 8':                  1.5,
  'Level 9':                  1.5,
  'Level 10':                 1.5,
  'Level 11':                 1.5,
  'Level 12':                 1.5
};

var dataset1 = ee.FeatureCollection(hydroshedsLevelMap['Level 8']);
var dataset2 = ee.FeatureCollection(hydroshedsLevelMap['Level 9']);
var dataset3 = ee.FeatureCollection(hydroshedsLevelMap['Level 10']);

var Sainj = dataset2.filter(ee.Filter.inList('HYBAS_ID', [4090712300, 4090710420, 4090710760])).union().first().geometry();
var Tirthan= dataset2.filter(ee.Filter.eq('HYBAS_ID', 4090712410)).first().geometry();

var BabuFinal = ee.FeatureCollection("projects/geeornek1/assets/Babu_Final");

var Chalakudy= BabuFinal.filter(ee.Filter.eq('name', 'Chalakudy')).first().geometry();
var Karapara= BabuFinal.filter(ee.Filter.eq('name', 'Karapara')).first().geometry();
var kannankuzhi=BabuFinal.filter(ee.Filter.eq('name', 'Kannankuzhi')).first().geometry();
var kuriarkutti=BabuFinal.filter(ee.Filter.eq('name', 'Kuriarkutti')).first().geometry();
var Parambikolam = BabuFinal.filter(ee.Filter.eq('name', 'Parambikolam')).first().geometry();
var Sholaiar = BabuFinal.filter(ee.Filter.eq('name', 'Sholaiar')).first().geometry();

var huc10 = ee.FeatureCollection('USGS/WBD/2017/HUC10');
var rainier_point = ee.Geometry.Point([-121.7603, 46.8528]);
var Rainier = huc10.filterBounds(rainier_point.buffer(15000))
                    .union().first().geometry();

var MaunaLoa_centroid = ee.Geometry.Point([-155.608, 19.475]);
var MaunaLoa = dataset2.filterBounds(MaunaLoa_centroid.buffer(20000))
                       .union().first().geometry();

var MaunaLoa = ee.Geometry.Polygon(
        [[[-155.7255511888828, 19.270556101329667],
          [-155.71387821525, 19.275741405080968],
          [-155.68503910392187, 19.277037705378227],
          [-155.6534534105625, 19.2861115202195],
          [-155.62255436271093, 19.295832906719784],
          [-155.59577518790624, 19.30684977999698],
          [-155.57242924064062, 19.32369768013421],
          [-155.55800968497655, 19.336656421374553],
          [-155.53466373771093, 19.352853401647952],
          [-155.52299076407812, 19.36969655531416],
          [-155.50994449942968, 19.391071897522902],
          [-155.48041874259374, 19.42151072107965],
          [-155.4563861498203, 19.451296390366725],
          [-155.42548710196874, 19.48949174428662],
          [-155.4069476732578, 19.505026260460568],
          [-155.395274699625, 19.528972383204323],
          [-155.39458805411718, 19.554856090838964],
          [-155.43166691153905, 19.58591105804733],
          [-155.45707279532812, 19.602083149152882],
          [-155.49415165275, 19.61243243450522],
          [-155.51406437247655, 19.613726048347157],
          [-155.54702335685155, 19.613726048347157],
          [-155.58616215079687, 19.611138810255895],
          [-155.62598759025, 19.60272999899564],
          [-155.65070682853124, 19.5904394073353],
          [-155.6754260668125, 19.565855409365884],
          [-155.69877201407812, 19.539326364285262],
          [-155.7145648607578, 19.50373177440951],
          [-155.72280460685155, 19.422158293717082],
          [-155.73173099845312, 19.39171959136746],
          [-155.73516422599218, 19.37163988414476],
          [-155.74065739005468, 19.361923008284634],
          [-155.7420306810703, 19.335360593519624],
          [-155.74271732657812, 19.31397794965613],
          [-155.74271732657812, 19.30684977999698],
          [-155.73791080802343, 19.29388867560811]]]);

var huc08 = ee.FeatureCollection('USGS/WBD/2017/HUC08');
var GrandCanyon = huc08.filter(ee.Filter.or(
  ee.Filter.eq('name', 'Marble Canyon'),
  ee.Filter.eq('name', 'Grand Canyon'),
  ee.Filter.eq('name', 'Lower Grand Canyon')
)).union().first().geometry();

var epaL3 = ee.FeatureCollection("EPA/Ecoregions/2013/L3");
var Smoky_Mts_USA = epaL3.filter(ee.Filter.eq('na_l3name', 'Blue Ridge')).first().geometry();

var DeathValley = huc08.filterBounds(ee.Geometry.Point([-116.8, 36.4]))
                       .filter(ee.Filter.stringContains('name', 'Death Valley'))
                       .union().first().geometry();

var Sandhills = epaL3.filter(ee.Filter.eq('na_l3name', 'Nebraska Sand Hills')).first().geometry();

var Ararat_hyd = dataset2.filterBounds(ee.Geometry.Point([44.298, 39.702]))
                         .union().first().geometry();
var Havran= dataset1.filter(ee.Filter.eq('HYBAS_ID', 2080002950)).first().geometry();

var Esmahanim = ee.FeatureCollection("projects/geeornek1/assets/Esmahanim");
var E1= Esmahanim.filter(ee.Filter.eq('name', '1')).first().geometry();
var E2= Esmahanim.filter(ee.Filter.eq('name', '2')).first().geometry();
var E3= Esmahanim.filter(ee.Filter.eq('name', '3')).first().geometry();
var E4= Esmahanim.filter(ee.Filter.eq('name', '4')).first().geometry();
var E5= Esmahanim.filter(ee.Filter.eq('name', '5')).first().geometry();
var E6= Esmahanim.filter(ee.Filter.eq('name', '6')).first().geometry();
var E7= Esmahanim.filter(ee.Filter.eq('name', '7')).first().geometry();
var E8= Esmahanim.filter(ee.Filter.eq('name', '8')).first().geometry();
var E9= Esmahanim.filter(ee.Filter.eq('name', '9')).first().geometry();
var E10= Esmahanim.filter(ee.Filter.eq('name', '10')).first().geometry();
var E11= Esmahanim.filter(ee.Filter.eq('name', '11')).first().geometry();
var E12= Esmahanim.filter(ee.Filter.eq('name', '12')).first().geometry();

var Wadi_feyran = ee.FeatureCollection("projects/geeornek1/assets/Wadi_feyran");
var B1= Wadi_feyran.filter(ee.Filter.eq('name', 'B1')).first().geometry();
var B2= Wadi_feyran.filter(ee.Filter.eq('name', 'B2')).first().geometry();
var B3= Wadi_feyran.filter(ee.Filter.eq('name', 'B3')).first().geometry();
var B4= Wadi_feyran.filter(ee.Filter.eq('name', 'B4')).first().geometry();
var B5= Wadi_feyran.filter(ee.Filter.eq('name', 'B5')).first().geometry();
var B6= Wadi_feyran.filter(ee.Filter.eq('name', 'B6')).first().geometry();
var B7= Wadi_feyran.filter(ee.Filter.eq('name', 'B7')).first().geometry();
var B8= Wadi_feyran.filter(ee.Filter.eq('name', 'B8')).first().geometry();
var B9= Wadi_feyran.filter(ee.Filter.eq('name', 'B9')).first().geometry();
var B10= Wadi_feyran.filter(ee.Filter.eq('name', 'B10')).first().geometry();
var B11= Wadi_feyran.filter(ee.Filter.eq('name', 'B11')).first().geometry();

var NAZF = ee.FeatureCollection("projects/geeornek1/assets/NAZF");
var N1= NAZF.filter(ee.Filter.eq('name', 'BOLU')).first().geometry();
var N2= NAZF.filter(ee.Filter.eq('name', 'SEBEN')).first().geometry();
var N3= NAZF.filter(ee.Filter.eq('name', 'YENICAGA')).first().geometry();
var N4= NAZF.filter(ee.Filter.eq('name', 'DORTDIVAN')).first().geometry();
var N5= NAZF.filter(ee.Filter.eq('name', 'ESKIPAZAR')).first().geometry();
var N6= NAZF.filter(ee.Filter.eq('name', 'CERKES')).first().geometry();
var N7= NAZF.filter(ee.Filter.eq('name', 'OVACIK')).first().geometry();
var N8= NAZF.filter(ee.Filter.eq('name', 'ARAC')).first().geometry();
var N9= NAZF.filter(ee.Filter.eq('name', 'TOSYA_ILGAZ')).first().geometry();
var N10= NAZF.filter(ee.Filter.eq('name', 'KASTAMONU')).first().geometry();
var N11= NAZF.filter(ee.Filter.eq('name', 'KAYABASI')).first().geometry();
var N12= NAZF.filter(ee.Filter.eq('name', 'BOYABAT')).first().geometry();
var N13= NAZF.filter(ee.Filter.eq('name', 'SARA')).first().geometry();
var N14= NAZF.filter(ee.Filter.eq('name', 'KARGI_VEZIRKOPRU')).first().geometry();

var Wahig = ee.FeatureCollection("WWF/HydroSHEDS/v1/Basins/hybas_8")
.filter(ee.Filter.eq('HYBAS_ID',5080027250)).first().geometry();

var Loboc = ee.FeatureCollection("WWF/HydroSHEDS/v1/Basins/hybas_8")
.filter(ee.Filter.eq('HYBAS_ID',5080027200)).first().geometry();

var misir = ee.FeatureCollection("projects/geeornek1/assets/MISIR");
var m1a= misir.filter(ee.Filter.eq('name', 'a')).first().geometry();
var m1b= misir.filter(ee.Filter.eq('name', 'b')).first().geometry();

var Grenada = ee.FeatureCollection("projects/geeornek1/assets/GRENADA_GEE");
var G1= Grenada.filter(ee.Filter.eq('name', 'AbrucenaRiver')).first().geometry();
var G2= Grenada.filter(ee.Filter.eq('name', 'Alcolea')).first().geometry();
var G3= Grenada.filter(ee.Filter.eq('name', 'AndaraxRiver')).first().geometry();
var G4= Grenada.filter(ee.Filter.eq('name', 'ChicoRiver')).first().geometry();
var G5= Grenada.filter(ee.Filter.eq('name', 'Hueneja')).first().geometry();
var G6= Grenada.filter(ee.Filter.eq('name', 'Nacimiento')).first().geometry();
var G7= Grenada.filter(ee.Filter.eq('name', 'SantillanaCreek')).first().geometry();
var G8= Grenada.filter(ee.Filter.eq('name', 'AbrucenaRiver')).first().geometry(); // same as G1
var G9= Grenada.filter(ee.Filter.eq('name', 'TicesCreek')).first().geometry();

// ═══════════════════════════════════════════════════════════════
// TEST CASES
// ═══════════════════════════════════════════════════════════════

var testCases = [
  { id: 1,  name: '1. NAFZ Bolu',          shortName: 'NAFZ_Bolu',          region: ee.Geometry(N1),  expectedHI: 0.36, category: 'Mature (NAFZ)',      reference: 'Sarp et al., 2020', tier:1 },
  { id: 2,  name: '2. NAFZ Seben',         shortName: 'NAFZ_Seben',         region: ee.Geometry(N2),  expectedHI: 0.43, category: 'Mature (NAFZ)',      reference: 'Sarp et al., 2020', tier:1 },
  { id: 3,  name: '3. NAFZ Yenicaga',      shortName: 'NAFZ_Yenicaga',      region: ee.Geometry(N3),  expectedHI: 0.41, category: 'Mature (NAFZ)',      reference: 'Sarp et al., 2020', tier:1 },
  { id: 4,  name: '4. NAFZ Dortdivan',     shortName: 'NAFZ_Dortdivan',     region: ee.Geometry(N4),  expectedHI: 0.32, category: 'Old (NAFZ)',         reference: 'Sarp et al., 2020', tier:1 },
  { id: 5,  name: '5. NAFZ Eskipazar',     shortName: 'NAFZ_Eskipazar',     region: ee.Geometry(N5),  expectedHI: 0.49, category: 'Mature (NAFZ)',      reference: 'Sarp et al., 2020', tier:1 },
  { id: 6,  name: '6. NAFZ Cerkes',        shortName: 'NAFZ_Cerkes',        region: ee.Geometry(N6),  expectedHI: 0.40, category: 'Mature (NAFZ)',      reference: 'Sarp et al., 2020', tier:1 },
  { id: 7,  name: '7. NAFZ Ovacik',        shortName: 'NAFZ_Ovacik',        region: ee.Geometry(N7),  expectedHI: 0.44, category: 'Mature (NAFZ)',      reference: 'Sarp et al., 2020', tier:1 },
  { id: 8,  name: '8. NAFZ Arac',          shortName: 'NAFZ_Arac',          region: ee.Geometry(N8),  expectedHI: 0.36, category: 'Mature (NAFZ)',      reference: 'Sarp et al., 2020', tier:1 },
  { id: 9,  name: '9. NAFZ TosyaIlgaz',    shortName: 'NAFZ_TosyaIlgaz',    region: ee.Geometry(N9),  expectedHI: 0.43, category: 'Mature (NAFZ)',      reference: 'Sarp et al., 2020', tier:1 },
  { id: 10, name: '10. NAFZ Kastamonu',    shortName: 'NAFZ_Kastamonu',     region: ee.Geometry(N10), expectedHI: 0.27, category: 'Old (NAFZ)',         reference: 'Sarp et al., 2020', tier:1 },
  { id: 11, name: '11. NAFZ Kayabasi',     shortName: 'NAFZ_Kayabasi',      region: ee.Geometry(N11), expectedHI: 0.56, category: 'Late Mature (NAFZ)', reference: 'Sarp et al., 2020', tier:1 },
  { id: 12, name: '12. NAFZ Boyabat',      shortName: 'NAFZ_Boyabat',       region: ee.Geometry(N12), expectedHI: 0.44, category: 'Mature (NAFZ)',      reference: 'Sarp et al., 2020', tier:1 },
  { id: 13, name: '13. NAFZ Sara',         shortName: 'NAFZ_Sara',          region: ee.Geometry(N13), expectedHI: 0.44, category: 'Mature (NAFZ)',      reference: 'Sarp et al., 2020', tier:1 },
  { id: 14, name: '14. NAFZ KargiVezirkopru', shortName: 'NAFZ_KargiVezirkopru', region: ee.Geometry(N14), expectedHI: 0.37, category: 'Mature (NAFZ)', reference: 'Sarp et al., 2020', tier:1 },

  { id: 15, name: '15. Sainj Watershed',   shortName: 'Sainj_India',        region: ee.Geometry(Sainj),   expectedHI: 0.51, category: 'Mature (Himalayan)', reference: 'Singh et al., 2008', tier:1 },
  { id: 16, name: '16. Tirthan Watershed', shortName: 'Tirthan_India',      region: ee.Geometry(Tirthan), expectedHI: 0.44, category: 'Mature (Himalayan)', reference: 'Singh et al., 2008', tier:1 },

  { id: 17, name: '17. Havran river basin', shortName: 'Havran',            region: ee.Geometry(Havran),  expectedHI: 0.27, category: '', reference: 'Ozdemir, 2007', tier:3 },

  { id: 18, name: '18. Esmahanim 1',  shortName: 'Esmahanim_1',  region: ee.Geometry(E1),  expectedHI: 0.40, category: 'Mature (W. Karadeniz)',      reference: 'Avci, 2023', tier:1 },
  { id: 19, name: '19. Esmahanim 2',  shortName: 'Esmahanim_2',  region: ee.Geometry(E2),  expectedHI: 0.45, category: 'Mature (W. Karadeniz)',      reference: 'Avci, 2023', tier:1 },
  { id: 20, name: '20. Esmahanim 3',  shortName: 'Esmahanim_3',  region: ee.Geometry(E3),  expectedHI: 0.41, category: 'Mature (W. Karadeniz)',      reference: 'Avci, 2023', tier:1 },
  { id: 21, name: '21. Esmahanim 4',  shortName: 'Esmahanim_4',  region: ee.Geometry(E4),  expectedHI: 0.53, category: 'Mature (W. Karadeniz)',      reference: 'Avci, 2023', tier:1 },
  { id: 22, name: '22. Esmahanim 5',  shortName: 'Esmahanim_5',  region: ee.Geometry(E5),  expectedHI: 0.44, category: 'Mature (W. Karadeniz)',      reference: 'Avci, 2023', tier:1 },
  { id: 23, name: '23. Esmahanim 6',  shortName: 'Esmahanim_6',  region: ee.Geometry(E6),  expectedHI: 0.49, category: 'Mature (W. Karadeniz)',      reference: 'Avci, 2023', tier:1 },
  { id: 24, name: '24. Esmahanim 7',  shortName: 'Esmahanim_7',  region: ee.Geometry(E7),  expectedHI: 0.44, category: 'Mature (W. Karadeniz)',      reference: 'Avci, 2023', tier:1 },
  { id: 25, name: '25. Esmahanim 8',  shortName: 'Esmahanim_8',  region: ee.Geometry(E8),  expectedHI: 0.56, category: 'Late Mature (W. Karadeniz)', reference: 'Avci, 2023', tier:1 },
  { id: 26, name: '26. Esmahanim 9',  shortName: 'Esmahanim_9',  region: ee.Geometry(E9),  expectedHI: 0.50, category: 'Mature (W. Karadeniz)',      reference: 'Avci, 2023', tier:1 },
  { id: 27, name: '27. Esmahanim 10', shortName: 'Esmahanim_10', region: ee.Geometry(E10), expectedHI: 0.55, category: 'Late Mature (W. Karadeniz)', reference: 'Avci, 2023', tier:1 },
  { id: 28, name: '28. Esmahanim 11', shortName: 'Esmahanim_11', region: ee.Geometry(E11), expectedHI: 0.51, category: 'Mature (W. Karadeniz)',      reference: 'Avci, 2023', tier:1 },
  { id: 29, name: '29. Esmahanim 12', shortName: 'Esmahanim_12', region: ee.Geometry(E12), expectedHI: 0.50, category: 'Mature (W. Karadeniz)',      reference: 'Avci, 2023', tier:1 },

  { id: 30, name: '30. Wahig-Inabanga', shortName: 'Wahig_Inabanga', region: ee.Geometry(Wahig), expectedHI: 0.22, category: 'Old (Philippines)',    reference: 'Torrefranca I. and Otadoy R.E, 2024', tier:1 },
  { id: 31, name: '31. Loboc Watershed', shortName: 'Loboc',         region: ee.Geometry(Loboc), expectedHI: 0.37, category: 'Mature (Philippines)', reference: 'Torrefranca I. and Otadoy R.E, 2024', tier:1 },

  { id: 32, name: '32. Wadi Talat Hamdh', shortName: 'Wadi_Talat_Hamdh', region: ee.Geometry(m1a), expectedHI: 0.63, category: 'Late Youth', reference: 'Khattab et al., 2023', tier:1 },
  { id: 33, name: '33. Wadi El-Salwely',  shortName: 'Wadi_El_Salwely',  region: ee.Geometry(m1b), expectedHI: 0.23, category: 'Old',        reference: 'Khattab et al., 2023', tier:1 },

  { id: 34, name: '47. Abrucena River - N slope',  shortName: 'Abrucena_N_Spain',   region: ee.Geometry(G1), expectedHI: 0.40,   category: 'Mature (N-slope, partially captured)', reference: 'Perez-Pena et al., 2009', tier:1 },
  { id: 35, name: '48. Hueneja River - N slope',   shortName: 'Hueneja_N_Spain',    region: ee.Geometry(G5), expectedHI: 0.32,   category: 'Old (Sierra Nevada N-slope)',          reference: 'Perez-Pena et al., 2009', tier:1 },
  { id: 36, name: '49. Nacimiento River - N slope',shortName: 'Nacimiento_N_Spain', region: ee.Geometry(G6), expectedHI: 0.35,   category: 'Mature (Sierra Nevada N-slope)',       reference: 'Perez-Pena et al., 2009', tier:1 },
  { id: 37, name: '50. Santillana Creek - N slope',shortName: 'Santillana_N_Spain', region: ee.Geometry(G7), expectedHI: 0.47,   category: 'Late Youth (N-slope, recently captured)', reference: 'Perez-Pena et al., 2009', tier:1 },
  { id: 38, name: '51. Alcolea River - S slope',   shortName: 'Alcolea_S_Spain',    region: ee.Geometry(G2), expectedHI: 0.50,   category: 'Mature (Sierra Nevada S-slope)',       reference: 'Perez-Pena et al., 2009', tier:1 },
  { id: 39, name: '52. Andarax River - S slope',   shortName: 'Andarax_S_Spain',    region: ee.Geometry(G3), expectedHI: 0.51,   category: 'Mature (Sierra Nevada S-slope)',       reference: 'Perez-Pena et al., 2009', tier:1 },
  { id: 40, name: '53. Chico River - S slope',     shortName: 'Chico_S_Spain',      region: ee.Geometry(G4), expectedHI: 0.50,   category: 'Mature (Sierra Nevada S-slope)',       reference: 'Perez-Pena et al., 2009', tier:1 },
  { id: 41, name: '54. Tices Creek - S slope',     shortName: 'Tices_S_Spain',      region: ee.Geometry(G8), expectedHI: 0.4607, category: 'Mature (Sierra Nevada S-slope)',       reference: 'Perez-Pena et al., 2009', tier:1 },


  { id: 42, name: '34. Chalakudy Basin',       shortName: 'Chalakudy_Kerala',   region: ee.Geometry(Chalakudy),    expectedHI: 0.4824, category: 'Mature (Western Ghats)', reference: 'Babu al., 2014', tier:2 },
  { id: 43, name: '35. Karapara Sub-basin',    shortName: 'Karapara_Kerala',    region: ee.Geometry(Karapara),     expectedHI: 0.6160, category: 'Youthful (Sub-basin)',   reference: 'Babu al., 2014', tier:2 },
  { id: 44, name: '36. Kannankuzhi Sub-basin', shortName: 'Kannankuzhi_Kerala', region: ee.Geometry(kannankuzhi),  expectedHI: 0.4377, category: 'Mature (Sub-basin)',     reference: 'Babu al., 2014', tier:2 },
  { id: 45, name: '37. Kuriarkutti Sub-basin', shortName: 'Kuriarkutti',        region: ee.Geometry(kuriarkutti),  expectedHI: 0.4824, category: 'Mature (Sub-basin)',     reference: 'Babu al., 2014', tier:2 },
  { id: 46, name: '38. Parambikolam Sub-basin',shortName: 'Parambikolam',       region: ee.Geometry(Parambikolam), expectedHI: 0.4796, category: 'Mature (Sub-basin)',     reference: 'Babu al., 2014', tier:2 },
  { id: 47, name: '39. Sholaiar Sub-basin',    shortName: 'Sholaiar',           region: ee.Geometry(Sholaiar),     expectedHI: 0.4388, category: 'Mature (Sub-basin)',     reference: 'Babu al., 2014', tier:2 },

  { id: 48, name: '40. Mount Rainier',      shortName: 'Rainier_USA',      region: ee.Geometry(Rainier),      expectedHI: 0.575, category: 'Mature Glaciated Volcanic', reference: 'Theoretical (no published HI)', tier:2 },
  { id: 49, name: '41. Mauna Loa',          shortName: 'Mauna_Loa_USA',    region: ee.Geometry(MaunaLoa),     expectedHI: 0.34,  category: 'Young Volcanic',            reference: 'Theoretical (no published HI)', tier:1 },
  { id: 50, name: '42. Grand Canyon',       shortName: 'Grand_Canyon_USA', region: ee.Geometry(GrandCanyon),  expectedHI: 0.50,  category: 'Mature Erosional',          reference: 'Theoretical (Strahler, 1952)',  tier:1 },
  { id: 51, name: '43. Great Smoky Mts',    shortName: 'Smoky_Mts_USA',    region: ee.Geometry(Smoky_Mts_USA),expectedHI: 0.45,  category: 'Mature Appalachian',        reference: 'Theoretical (no published HI)', tier:1 },
  { id: 52, name: '44. Death Valley',       shortName: 'Death_Valley_USA', region: ee.Geometry(DeathValley),  expectedHI: 0.30,  category: 'Old Deeply Eroded',         reference: 'Theoretical (no published HI)', tier:2 },
  { id: 53, name: '45. Nebraska Sandhills', shortName: 'Nebraska_USA',     region: ee.Geometry(Sandhills),    expectedHI: 0.225, category: 'Old Low-Relief Aeolian',    reference: 'Theoretical (no published HI)', tier:2 },

  // { id: 54, name: '46. Lake Nemrut', shortName: 'Nemrut', region: ee.Geometry.Rectangle([42.1358, 38.5573, 42.3545, 38.703]), expectedHI: 0.45, category: '', reference: 'Ulusoy et al. (2012)', tier:3 },
  // { id: 55, name: '55. Wadi Feyran B1', shortName: 'Wadi_Feyran', region: ee.Geometry(B11), expectedHI: 0.3, category: '', reference: 'Youssef, 2011', tier:3 }
];




// ═══════════════════════════════════════════════════════════════
// DEM SOURCES
// ═══════════════════════════════════════════════════════════════

var demSources = [
  { id: 'SRTM',      name: 'SRTM GL1 (30m)',        scale: 30,  image: 'USGS/SRTMGL1_003',          bandName: 'elevation', color: '#D32F2F', coverage: 'Global (60°N-56°S)', checkBounds: function(lat, lon) { return lat < 60 && lat > -56; } },
  { id: 'COPERNICUS',name: 'Copernicus DEM (30m)',   scale: 30,  image: 'COPERNICUS/DEM/GLO30',       bandName: 'DEM',       color: '#1976D2', coverage: 'Global',            checkBounds: function(lat, lon) { return true; } },
  { id: 'ALOS',      name: 'ALOS World 3D (30m)',    scale: 30,  image: 'JAXA/ALOS/AW3D30/V3_2',     bandName: 'DSM',       color: '#388E3C', coverage: 'Global',            checkBounds: function(lat, lon) { return true; } },
  { id: 'NASADEM',   name: 'NASADEM (30m)',           scale: 30,  image: 'NASA/NASADEM_HGT/001',       bandName: 'elevation', color: '#F57C00', coverage: 'Global (60°N-56°S)', checkBounds: function(lat, lon) { return lat < 60 && lat > -56; } },
  { id: 'ASTER',     name: 'ASTER GDEM v3 (30m)',    scale: 30,  image: 'NASA/ASTER_GED/AG100_003',   bandName: 'elevation', color: '#9C27B0', coverage: 'Global (60°N-56°S)', checkBounds: function(lat, lon) { return lat < 60 && lat > -56; } },
  { id: 'NED',       name: 'USGS NED (10m)',          scale: 10,  image: 'USGS/NED',                   bandName: 'elevation', color: '#7B1FA2', coverage: 'USA Only',          checkBounds: function(lat, lon) { return (lat > 18 && lat < 72) && (lon > -170 && lon < -66); } }
];


// ═══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

function removeLayerByName(name) {
  var layers = map.layers();
  for (var i = layers.length() - 1; i >= 0; i--) {
    var layer = layers.get(i);
    if (layer.getName() && layer.getName().indexOf(name) === 0) {
      layers.remove(layer);
    }
  }
}

function getDEM(demSource, region) {
  var dem;
  if (demSource.id === 'COPERNICUS' || demSource.id === 'ALOS') {
    dem = ee.ImageCollection(demSource.image).select(demSource.bandName).mosaic().clip(region);
  } else {
    dem = ee.Image(demSource.image).select(demSource.bandName).clip(region);
  }
  return dem.rename('elevation');
}

function calculateHypsometric(region, selectedDEMs) {
  var percentiles = ee.List.sequence(0, 100, 2);
  var results = [];

  selectedDEMs.forEach(function(src) {
    var dem = getDEM(src, region);
    var combinedReducer = ee.Reducer.minMax()
      .combine({reducer2: ee.Reducer.mean(), sharedInputs: true})
      .combine({reducer2: ee.Reducer.percentile(percentiles), sharedInputs: true});

    var stats = dem.reduceRegion({
      reducer: combinedReducer,
      geometry: region,
      scale: src.scale,
      maxPixels: 1e9,
      bestEffort: true
    });

    var minObj = stats.get('elevation_min');
    var maxObj = stats.get('elevation_max');
    var meanObj = stats.get('elevation_mean');

    var HI = ee.Algorithms.If(
      meanObj,
      ee.Number(meanObj).subtract(ee.Number(minObj)).divide(ee.Number(maxObj).subtract(ee.Number(minObj))),
      -1
    );

    var HI_integral = ee.Algorithms.If(
      meanObj,
      (function() {
        var range = ee.Number(maxObj).subtract(ee.Number(minObj));
        var points = percentiles.map(function(p) {
          p = ee.Number(p);
          var key = ee.String('elevation_p').cat(p.format('%d'));
          var elevVal = stats.get(key);
          var yVal = ee.Algorithms.If(
            elevVal,
            ee.Number(elevVal).subtract(ee.Number(minObj)).divide(range),
            0
          );
          var xVal = ee.Number(1).subtract(p.divide(100));
          return ee.List([xVal, ee.Number(yVal)]);
        });
        var n = points.length();
        var indices = ee.List.sequence(0, n.subtract(2));
        var areas = indices.map(function(i) {
          i = ee.Number(i);
          var p1 = ee.List(points.get(i));
          var p2 = ee.List(points.get(i.add(1)));
          var x1 = ee.Number(p1.get(0));
          var y1 = ee.Number(p1.get(1));
          var x2 = ee.Number(p2.get(0));
          var y2 = ee.Number(p2.get(1));
          var dx = x1.subtract(x2).abs();
          return y1.add(y2).multiply(0.5).multiply(dx);
        });
        return ee.Number(ee.List(areas).reduce(ee.Reducer.sum()));
      })(),
      -1
    );

    var totalArea = ee.Image.pixelArea().clip(region).reduceRegion({
      reducer: ee.Reducer.sum(),
      geometry: region,
      scale: src.scale,
      maxPixels: 1e9,
      bestEffort: true
    }).get('area');

    results.push({
      demId: src.id,
      demName: src.name,
      demColor: src.color,
      bandName: 'elevation',
      stats: stats,
      min: ee.Number(ee.Algorithms.If(minObj, minObj, 0)),
      max: ee.Number(ee.Algorithms.If(maxObj, maxObj, 1)),
      mean: meanObj,
      HI: HI,
      HI_integral: HI_integral,
      totalArea: totalArea
    });
  });
  return results;
}

// ═══════════════════════════════════════════════════════════════
// CHART GENERATION
// ═══════════════════════════════════════════════════════════════

function generateChart(results, regionName, mode, evaluatedStats) {
  var validResults = results;
  if (evaluatedStats) {
    validResults = results.filter(function(r, idx) {
      var s = evaluatedStats[idx];
      return s && s.hi !== null && s.hi !== -1 && s.max !== null && s.min !== null;
    });
  }

  if (validResults.length === 0) {
    return ui.Label('⚠️ No valid DEM data available for chart.', {color: 'red', fontWeight: 'bold'});
  }

  var percentiles = ee.List.sequence(0, 100, 2);

  var chartFeatures = percentiles.map(function(p) {
    var pct = ee.Number(p);
    var xValue = (mode === 'normalized') ?
      ee.Number(1).subtract(pct.divide(100)) :
      ee.Number(100).subtract(pct);

    var properties = ee.Dictionary({'X_Axis': xValue});

    validResults.forEach(function(result) {
      var pKey = ee.String('elevation').cat('_p').cat(pct.format('%d'));
      var valObj = result.stats.get(pKey);

      var yValue;
      if (mode === 'normalized') {
        yValue = ee.Algorithms.If(
          valObj,
          ee.Number(valObj).subtract(result.min).divide(result.max.subtract(result.min)),
          0
        );
      } else {
        yValue = ee.Algorithms.If(valObj, ee.Number(valObj), 0);
      }

      properties = ee.Dictionary(ee.Algorithms.If(
        valObj,
        properties.set(result.demId, yValue),
        properties
      ));
    });

    return ee.Feature(null, properties);
  });

  var fc = ee.FeatureCollection(chartFeatures);
  var demIds = validResults.map(function(r) { return r.demId; });
  var demNames = validResults.map(function(r) { return r.demName; });

  var hTitle = (mode === 'normalized') ? 'Relative Area (a/A)' : 'Cumulative Area (%)';
  var vTitle = (mode === 'normalized') ? 'Relative Elevation (h/H)' : 'Altitude (m)';
  var chartTitle = (mode === 'normalized') ? 'Hypsometric Curves (Normalized) - ' + regionName : 'Hypsometric Curves (Absolute) - ' + regionName;
  var xWindow = (mode === 'normalized') ? {min: 0, max: 1} : {min: 0, max: 100};
  var yWindow = (mode === 'normalized') ? {min: 0, max: 1} : null;

  var chart = ui.Chart.feature.byFeature({
    features: fc,
    xProperty: 'X_Axis',
    yProperties: demIds
  })
  .setSeriesNames(demNames)
  .setChartType('LineChart')
  .setOptions({
    title: chartTitle,
    hAxis: { title: hTitle, viewWindow: xWindow, gridlines: {count: 5} },
    vAxis: { title: vTitle, viewWindow: yWindow, gridlines: {count: 5} },
    lineWidth: 2.5,
    pointSize: 0,
    curveType: 'function',
    interpolateNulls: true,
    width: '100%',
    height: 350,
    legend: {position: 'top', alignment: 'end', maxLines: 3},
    chartArea: {left: 70, top: 60, width: '85%', height: '70%'}
  });

  return chart;
}

// ═══════════════════════════════════════════════════════════════
// UI COMPONENTS
// ═══════════════════════════════════════════════════════════════

var activeTestCaseRegion = null;
var currentRegionName = 'User Defined Region';
var suppressTestCaseChange = false;

var title = ui.Label({
  value: 'BATU Hypsometric Analysis Tool',
  style: { fontSize: '24px', fontWeight: 'bold', color: '#1976D2', margin: '5px 0px' }
});

var instructions = ui.Label({
  value: 'HOW TO USE:\n1. Select a region (Default is NAFZ-Bolu)\n2. Select which DEMs to analyze\n3. Click "Calculate" (Auto-runs on load)\n4. View results in the panel below',
  style: { fontSize: '13px', margin: '5px 0px', whiteSpace: 'pre' }
});

var demCheckboxes = [];
var demSelectionPanel = ui.Panel({
  widgets: [ui.Label({value: 'Select DEMs:', style: {fontWeight: 'bold', margin: '0px', padding: '0px'}})],
  style: {margin: '1px 0px', padding: '0px'}
});

demSources.forEach(function(src) {
  var checkbox = ui.Checkbox({
    label: src.name + ' (' + src.coverage + ')',
    value: true,
    style: { margin: '0px 0px 0px 0px', padding: '0px', fontSize: '12px' }
  });
  demCheckboxes.push({source: src, checkbox: checkbox});
  demSelectionPanel.add(checkbox);
});

var siteInfoPanel = ui.Panel({
  style: {
    shown: false,
    backgroundColor: '#E3F2FD',
    border: '2px solid #1976D2',
    padding: '2px',
    margin: '1px 0px'
  }
});

function loadTestCase(selectedName) {
  if (suppressTestCaseChange) return;
  var selected = testCases.filter(function(tc) { return tc.name === selectedName; })[0];
  if (!selected) return;
  activeTestCaseRegion = selected;

  drawingTools.layers().reset();
  removeLayerByName('TestCase_Box');
  removeLayerByName('Vis-DEM');
  removeLayerByName('Contours');
  removeLayerByName('Boundary');
  removeLayerByName('ClickedWatershed');

  siteInfoPanel.clear();
  siteInfoPanel.style().set('shown', true);

  var tierLabel = (selected.tier === 1) ? '✅ TIER 1: Published & Validated' : '⚠️ TIER 2: Theoretical Expectation';
  var tierColor = (selected.tier === 1) ? '#2E7D32' : '#F57C00';

  siteInfoPanel.add(ui.Label({value: tierLabel, style: {fontSize: '12px', fontWeight: 'bold', color: tierColor, margin: '0 0 5px 0'}}));
  siteInfoPanel.add(ui.Label({value: '📍 Site: ' + selected.shortName, style: {fontSize: '12px', fontWeight: 'bold', margin: '2px 0'}}));

  if (selected.expectedHI !== undefined) {
    siteInfoPanel.add(ui.Label({value: '📊 Expected HI: ' + selected.expectedHI.toFixed(3), style: {fontSize: '12px', color: '#1976D2', fontWeight: 'bold', margin: '2px 0'}}));
  }
  if (selected.category) {
    siteInfoPanel.add(ui.Label({value: '🏔️ Category: ' + selected.category, style: {fontSize: '11px', color: '#666', margin: '2px 0'}}));
  }
  if (selected.reference) {
    siteInfoPanel.add(ui.Label({value: '📚 Reference: ' + selected.reference, style: {fontSize: '11px', color: '#666', margin: '2px 0', fontStyle: 'italic'}}));
  }

  var layer = ui.Map.Layer(ee.FeatureCollection(selected.region).style({color: 'red', fillColor: '00000000'}), {}, 'TestCase_Box');
  map.layers().add(layer);
  map.centerObject(selected.region);

  statusLabel.setValue('✅ ' + selected.shortName + ' selected.');
  statusLabel.style().set('color', '#1976D2');
  resultsPanel.style().set('shown', false);
  calculateButton.setDisabled(false);
  calculateButton.style().set({ color: 'black', backgroundColor: '#FFC107', fontWeight: 'bold' });
  runAnalysis();
}

var testCaseSelect = ui.Select({
  items: testCases.map(function(tc) { return tc.name; }),
  placeholder: '📍 Select a Test Case Region...',
  value: testCases[0].name,
  style: { stretch: 'horizontal', margin: '5px 0px 10px 0px' },
  onChange: loadTestCase
});

// ═══════════════════════════════════════════════════════════════
// WATERSHED DATASET SELECTOR (HUC / HYDROSHEDS)
// ═══════════════════════════════════════════════════════════════

var currentWatershedFC = null;

var datasetLevelSelect = ui.Select({
  items: [],
  placeholder: '2️⃣ Select Level / Scale...',
  disabled: true,
  style: { stretch: 'horizontal', margin: '3px 0px 8px 0px' },
  onChange: function(selected) {
    if (!selected) return;

    var datasetType = datasetTypeSelect.getValue();
    var isHUC = (datasetType === 'HUC (USA)');

    var assetPath = isHUC ? hucLevelMap[selected] : hydroshedsLevelMap[selected];
    if (!assetPath) return;

    currentWatershedFC = ee.FeatureCollection(assetPath);

    // Clear results — same as pressing Clear Results button
    resultsPanel.clear();
    resultsPanel.style().set('shown', false);
    siteInfoPanel.clear();
    siteInfoPanel.style().set('shown', false);
    drawingTools.layers().reset();
    removeLayerByName('Vis-DEM');
    removeLayerByName('Contours');
    removeLayerByName('Boundary');
    removeLayerByName('TestCase_Box');
    removeLayerByName('ClickedWatershed');
    suppressTestCaseChange = true;
    testCaseSelect.setValue(null);
    suppressTestCaseChange = false;
    activeTestCaseRegion = null;
    calculateButton.setDisabled(true);
    calculateButton.style().set({ color: '#888', backgroundColor: '#EEEEEE', fontWeight: 'normal' });

    // Determine zoom and line width for this level
    var targetZoom  = isHUC ? (hucZoomMap[selected]        || 5)   : (hydroshedsZoomMap[selected]  || 4);
    var lineWidth   = isHUC ? (hucWidthMap[selected]        || 2)   : (hydroshedsWidthMap[selected] || 2);

    // Remove old watershed display layer
    removeLayerByName('WatershedLayer');

    // Add watershed boundaries with level-appropriate thickness
    var styledLayer = currentWatershedFC.style({
      color: '1565C0',
      fillColor: '1976D208',
      width: lineWidth
    });
    map.addLayer(styledLayer, {}, 'WatershedLayer: ' + datasetType + ' – ' + selected);

    statusLabel.setValue('🗺️ ' + datasetType + ' ' + selected + ' layer loaded.\n👆 Click any watershed boundary to run analysis.');
    statusLabel.style().set('color', '#1565C0');
    try { map.style().set('cursor', 'crosshair'); } catch(e) {}
  }
});

var datasetTypeSelect = ui.Select({
  items: ['HUC (USA)', 'HYDROSHEDS (Global)'],
  placeholder: '1️⃣ Select Dataset Type...',
  style: { stretch: 'horizontal', margin: '5px 0px 3px 0px' },
  onChange: function(selected) {
    var levelKeys = (selected === 'HUC (USA)') ?
      Object.keys(hucLevelMap) :
      Object.keys(hydroshedsLevelMap);

    datasetLevelSelect.items().reset(levelKeys);
    datasetLevelSelect.setValue(null);
    datasetLevelSelect.setDisabled(false);

    if (selected === 'HUC (USA)') {
      map.setCenter(-96, 38, 4);
    }

    removeLayerByName('WatershedLayer');
    removeLayerByName('ClickedWatershed');
    currentWatershedFC = null;
    try { map.style().set('cursor', 'hand'); } catch(e) {}
  }
});

// ═══════════════════════════════════════════════════════════════
// STATUS / BUTTONS
// ═══════════════════════════════════════════════════════════════

var statusLabel = ui.Label({
  value: '📍 Draw a region on the map to begin',
  style: { fontSize: '12px', color: '#666', margin: '10px 0px', fontStyle: 'italic', whiteSpace: 'pre' }
});

var calculateButton = ui.Button({
  label: '🔍 Calculate Hypsometric Curves',
  style: { stretch: 'horizontal', color: '#888', backgroundColor: '#EEEEEE' },
  disabled: true
});

var resultsPanel = ui.Panel({
  style: { shown: false, width: '440px', padding: '10px', backgroundColor: 'white', border: '1px solid #ddd' }
});

var clearButton = ui.Button({
  label: '🗑️ Clear Results',
  style: { stretch: 'horizontal' },
  onClick: function() {
    resultsPanel.clear();
    resultsPanel.style().set('shown', false);
    siteInfoPanel.style().set('shown', false);
    statusLabel.setValue('📍 Draw a new region or select a test case');
    drawingTools.layers().reset();
    drawingTools.setShown(true);
    removeLayerByName('Vis-DEM');
    removeLayerByName('Contours');
    removeLayerByName('Boundary');
    removeLayerByName('ClickedWatershed');
    testCaseSelect.setValue(null);
    calculateButton.setDisabled(true);
    calculateButton.style().set({ color: '#888', backgroundColor: '#EEEEEE', fontWeight: 'normal' });
  }
});


// ═══════════════════════════════════════════════════════════════
// HARLIN (1978) STATISTICAL MOMENTS OF HYPSOMETRIC CURVE
// ═══════════════════════════════════════════════════════════════

// Solve 4×4 linear system using Gaussian elimination with partial pivoting
function gaussianElim4(A, b) {
  var n = 4;
  var M = [];
  for (var i = 0; i < n; i++) { M.push(A[i].slice()); M[i].push(b[i]); }
  for (var col = 0; col < n; col++) {
    var maxRow = col;
    for (var row = col + 1; row < n; row++) {
      if (Math.abs(M[row][col]) > Math.abs(M[maxRow][col])) maxRow = row;
    }
    var tmp = M[col]; M[col] = M[maxRow]; M[maxRow] = tmp;
    if (Math.abs(M[col][col]) < 1e-12) return null;
    for (var row = col + 1; row < n; row++) {
      var f = M[row][col] / M[col][col];
      for (var j = col; j <= n; j++) M[row][j] -= f * M[col][j];
    }
  }
  var x = [0, 0, 0, 0];
  for (var i = n - 1; i >= 0; i--) {
    x[i] = M[i][n];
    for (var j = i + 1; j < n; j++) x[i] -= M[i][j] * x[j];
    x[i] /= M[i][i];
  }
  return x;
}

// R² goodness of fit
function computeR2hyp(xs, ys, a) {
  var yMean = 0;
  for (var i = 0; i < ys.length; i++) yMean += ys[i];
  yMean /= ys.length;
  var ssTot = 0, ssRes = 0;
  for (var i = 0; i < xs.length; i++) {
    var xi = xs[i];
    var yP = a[0] + a[1]*xi + a[2]*xi*xi + a[3]*xi*xi*xi;
    ssTot += (ys[i] - yMean) * (ys[i] - yMean);
    ssRes += (ys[i] - yP)   * (ys[i] - yP);
  }
  return (ssTot > 0) ? 1 - ssRes / ssTot : 0;
}

// Compute Harlin (1978) statistical moments from evaluated percentile data
// pcts : [elev_p0, elev_p2, ..., elev_p100]  (51 values, -9999 = missing)
// Returns { a, HI_poly, skew, kurtosis, densitySkew, densityKurtosis, r2 } or null
function computeHarlinMoments(pcts, minElev, maxElev) {
  var range = maxElev - minElev;
  if (range <= 0) return null;

  // Build (x, y) pairs: x = a/A = 1 - p/100, y = h/H = (elev - min)/range
  var xs = [], ys = [];
  for (var i = 0; i <= 50; i++) {
    var elev = pcts[i];
    if (elev === -9999 || elev === null || elev === undefined) continue;
    xs.push(1 - (i * 2) / 100);
    ys.push((elev - minElev) / range);
  }
  if (xs.length < 4) return null;

  // Build normal equations for 3rd-order polynomial least-squares
  var S = [0,0,0,0,0,0,0]; // S[k] = Σ xᵢᵏ
  var T = [0,0,0,0];        // T[k] = Σ xᵢᵏ · yᵢ
  for (var i = 0; i < xs.length; i++) {
    var xi = xs[i], yi = ys[i], xp = 1;
    for (var k = 0; k <= 6; k++) { S[k] += xp; if (k <= 3) T[k] += xp * yi; xp *= xi; }
  }
  var AM = [
    [S[0],S[1],S[2],S[3]],
    [S[1],S[2],S[3],S[4]],
    [S[2],S[3],S[4],S[5]],
    [S[3],S[4],S[5],S[6]]
  ];
  var a = gaussianElim4(AM, T);
  if (!a) return null;

  // Integrals: I[n] = ∫₀¹ xⁿ f(x) dx = Σₖ aₖ/(k+n+1)
  var I = [];
  for (var n = 0; n <= 4; n++) {
    var v = 0;
    for (var k = 0; k <= 3; k++) v += a[k] / (k + n + 1);
    I.push(v);
  }
  var A_val = I[0]; // HI from polynomial
  if (Math.abs(A_val) < 1e-10) return null;

  var mu   = I[1] / A_val;
  var m2   = I[2] / A_val - mu * mu;
  var sig  = Math.sqrt(Math.max(m2, 0));
  var m3   = I[3] / A_val - 3 * mu * I[2] / A_val + 2 * mu * mu * mu;
  var m4   = I[4] / A_val - 4 * mu * I[3] / A_val
             + 6 * mu * mu * I[2] / A_val - 3 * Math.pow(mu, 4);

  var hypSkew     = (sig > 0) ? m3 / Math.pow(sig, 3) : 0;
  var hypKurtosis = (sig > 0) ? m4 / Math.pow(sig, 4) : 0;

  // Density function g(x) = f'(x) = a1 + 2a2·x + 3a3·x²
  var bc = [a[1], 2 * a[2], 3 * a[3]]; // [b0, b1, b2]
  var Id = [];
  for (var n = 0; n <= 4; n++) {
    var v = 0;
    for (var k = 0; k <= 2; k++) v += bc[k] / (k + n + 1);
    Id.push(v);
  }
  var Ag = Id[0];
  var mu_d = (Math.abs(Ag) > 1e-10) ? Id[1] / Ag : 0;
  var m2_d = (Math.abs(Ag) > 1e-10) ? Id[2] / Ag - mu_d * mu_d : 0;
  var sig_d = Math.sqrt(Math.max(m2_d, 0));
  var m3_d  = (Math.abs(Ag) > 1e-10) ? Id[3] / Ag - 3 * mu_d * Id[2] / Ag + 2 * Math.pow(mu_d, 3) : 0;
  var m4_d  = (Math.abs(Ag) > 1e-10) ? Id[4] / Ag - 4 * mu_d * Id[3] / Ag
              + 6 * mu_d * mu_d * Id[2] / Ag - 3 * Math.pow(mu_d, 4) : 0;

  var densitySkew     = (sig_d > 0) ? m3_d / Math.pow(sig_d, 3) : 0;
  var densityKurtosis = (sig_d > 0) ? m4_d / Math.pow(sig_d, 4) : 0;

  return {
    a: a,
    HI_poly:        A_val,
    skew:           hypSkew,
    kurtosis:       hypKurtosis,
    densitySkew:    densitySkew,
    densityKurtosis:densityKurtosis,
    r2:             computeR2hyp(xs, ys, a)
  };
}

// ═══════════════════════════════════════════════════════════════
// MAIN CALCULATION LOGIC
// ═══════════════════════════════════════════════════════════════

function runAnalysis() {
  var geometry = null;
  var finalRegionName = '';
  if (drawingTools.layers().length() > 0) {
    geometry = drawingTools.layers().get(0).getEeObject();
    finalRegionName = 'User Defined Region';
  } else if (activeTestCaseRegion !== null) {
    geometry = activeTestCaseRegion.region;
    finalRegionName = activeTestCaseRegion.name;
  }

  if (!geometry) {
    statusLabel.setValue('❌ Please draw a region or select a test case!');
    statusLabel.style().set('color', 'red');
    return;
  }

  var userSelectedDEMs = [];
  demCheckboxes.forEach(function(item) {
    if (item.checkbox.getValue()) userSelectedDEMs.push(item.source);
  });

  if (userSelectedDEMs.length === 0) {
    statusLabel.setValue('❌ Please select at least one DEM!');
    statusLabel.style().set('color', 'red');
    return;
  }

  setUILocked(true);
  statusLabel.setValue('⏳ Checking data availability...');
  statusLabel.style().set('color', '#FF9800');

  geometry.centroid(1).coordinates().evaluate(function(coords) {
    if (!coords) { statusLabel.setValue('❌ Error: Invalid region.'); setUILocked(false); return; }
    var regionLon = coords[0];
    var regionLat = coords[1];
    var validDEMs = [];
    var skippedDEMs = [];

    userSelectedDEMs.forEach(function(src) {
      if (src.checkBounds(regionLat, regionLon)) validDEMs.push(src);
      else skippedDEMs.push(src.name);
    });

    if (validDEMs.length === 0) {
      statusLabel.setValue('❌ None of the selected DEMs cover this region!');
      statusLabel.style().set('color', 'red');
      setUILocked(false);
      return;
    }

    statusLabel.setValue('⏳ Calculating (' + validDEMs.length + ' DEMs)...');

    var results = calculateHypsometric(geometry, validDEMs);

    var statsToEvaluate = results.map(function(r) {
      var pctList = ee.List.sequence(0, 100, 2).map(function(p) {
        p = ee.Number(p);
        var key = ee.String('elevation_p').cat(p.format('%d'));
        return ee.Algorithms.If(r.stats.get(key), r.stats.get(key), -9999);
      });
      return {
        hi: r.HI,
        hi_int: r.HI_integral,
        min: r.min,
        max: r.max,
        mean: ee.Algorithms.If(r.mean, r.mean, -9999),
        totalArea: ee.Algorithms.If(r.totalArea, r.totalArea, 0),
        percentiles: pctList
      };
    });

    ee.List(statsToEvaluate).evaluate(function(evaluatedStats, error) {
      if (error) { statusLabel.setValue('❌ GEE Error: ' + error); setUILocked(false); return; }

      removeLayerByName('Vis-DEM');
      removeLayerByName('Contours');
      removeLayerByName('Boundary');
      removeLayerByName('TestCase_Box');
      drawingTools.layers().forEach(function(l) { l.setShown(false); });

      var dem = getDEM(validDEMs[0], geometry);
      var minElev = evaluatedStats[0].min;
      var maxElev = evaluatedStats[0].max;
      var range = maxElev - minElev;

      // Standard hypsometric tint — absolute elevation breakpoints.
      // With SLD intervals: color at quantity Q applies to pixels where value > prev_Q AND value <= Q.
      // So to make ALL below-sea-level land blue, the blue entry must be at quantity=0.
      var hypsoSLD =
        '<RasterSymbolizer>' +
          '<ColorMap type="intervals" extended="false">' +
            '<ColorMapEntry color="#5080C0" quantity="-500"  label="Deep depression"/>' +
            '<ColorMapEntry color="#7BBAE8" quantity="0"     label="Below sea level (≤0m) — blue"/>' +
            '<ColorMapEntry color="#4C9E5A" quantity="200"   label="Lowlands 0-200m"/>' +
            '<ColorMapEntry color="#A8D080" quantity="500"   label="500m"/>' +
            '<ColorMapEntry color="#D4E89A" quantity="1000"  label="1000m"/>' +
            '<ColorMapEntry color="#F5E67A" quantity="1500"  label="1500m"/>' +
            '<ColorMapEntry color="#E8C96A" quantity="2000"  label="2000m"/>' +
            '<ColorMapEntry color="#D4A050" quantity="2500"  label="2500m"/>' +
            '<ColorMapEntry color="#B87840" quantity="3000"  label="3000m"/>' +
            '<ColorMapEntry color="#9A5828" quantity="4000"  label="4000m"/>' +
            '<ColorMapEntry color="#7A3A18" quantity="5000"  label="5000m"/>' +
            '<ColorMapEntry color="#C8B8A0" quantity="6000"  label="6000m"/>' +
            '<ColorMapEntry color="#E8E0D0" quantity="7000"  label="7000m"/>' +
            '<ColorMapEntry color="#FFFFFF" quantity="9000"  label="8000m+"/>' +
          '</ColorMap>' +
        '</RasterSymbolizer>';
      map.addLayer(dem.clip(geometry).sldStyle(hypsoSLD), {}, 'Vis-DEM (' + validDEMs[0].name + ')', true);

      var step = (range > 3000) ? 250 : (range > 1500) ? 100 : (range > 500) ? 50 : 20;
      var startLevel = Math.floor(minElev / step) * step;
      var endLevel = Math.ceil(maxElev / step) * step;
      var levels = ee.List.sequence(startLevel, endLevel, step);
      var contourImages = levels.map(function(level) {
        var mycontour = dem.convolve(ee.Kernel.gaussian(5, 3)).subtract(ee.Image.constant(level)).zeroCrossing().multiply(ee.Image.constant(level)).toFloat();
        return mycontour.mask(mycontour);
      });
      var vectors = ee.ImageCollection(contourImages).mosaic().int().reduceToVectors({
        geometry: geometry, scale: validDEMs[0].scale, geometryType: 'polygon',
        eightConnected: false, labelProperty: 'elevation', maxPixels: 1e13
      });
      // Evaluate vectors server-side first so the heavy reduceToVectors
      // computation finishes before we unlock the UI.
      vectors.size().evaluate(function(size, vecError) {
        // Add contour + boundary layers (tiles will render progressively)
        map.addLayer(vectors, {color: '000000', strokeWidth: 1}, 'Contours (' + step + 'm)', true);
        var boundary = ee.Image().byte().paint({featureCollection: ee.FeatureCollection(geometry), color: 1, width: 3});
        map.addLayer(boundary, {palette: ['FF0000']}, 'Boundary', true);
      });

      resultsPanel.clear();
      resultsPanel.style().set('shown', true);

      if (skippedDEMs.length > 0) {
        var warnPanel = ui.Panel({style: {backgroundColor: '#FFF3E0', border: '1px solid #FFB74D', padding: '5px', margin: '0 0 10px 0'}});
        warnPanel.add(ui.Label('⚠️ Note: Some DEMs skipped: ' + skippedDEMs.join(', '), {fontSize: '11px', fontWeight:'bold', color: '#E65100'}));
        resultsPanel.add(warnPanel);
      }

      resultsPanel.add(ui.Label({value: '📊 Analysis Results', style: { fontSize: '18px', fontWeight: 'bold', margin: '0 0 2px 0' }}));
      resultsPanel.add(ui.Label({value: finalRegionName, style: { fontSize: '12px', color: '#1976D2', margin: '0 0 5px 0' }}));

      var chartContainer = ui.Panel();
      var chartToggle = ui.Checkbox({
        label: 'Show Normalized Curve (Dimensionless: a/A vs h/H)',
        value: false,
        style: {fontWeight: 'bold', margin: '0px 0px'},
        onChange: function(checked) {
          chartContainer.clear();
          var mode = checked ? 'normalized' : 'absolute';
          var newChart = generateChart(results, finalRegionName, mode, evaluatedStats);
          chartContainer.add(newChart);
        }
      });

      resultsPanel.add(chartToggle);
      resultsPanel.add(chartContainer);

      var initialChart = generateChart(results, finalRegionName, 'absolute', evaluatedStats);
      chartContainer.add(initialChart);

      resultsPanel.add(ui.Label({value: 'Hypsometric Integral (HI) Values:', style: { fontWeight: 'bold', margin: '0px 0 2px 0' }}));

      // Only show validation panel for test cases that have expectedHI
      if (activeTestCaseRegion !== null && activeTestCaseRegion.expectedHI !== undefined) {
        var expectedPanel = ui.Panel({style: {backgroundColor: '#E3F2FD', border: '1px solid #1976D2', padding: '6px', margin: '0 0 8px 0'}});
        expectedPanel.add(ui.Label({value: '📖 Published/Expected HI: ' + activeTestCaseRegion.expectedHI.toFixed(3), style: {fontSize: '13px', fontWeight: 'bold', color: '#1565C0', margin: '0 0 2px 0'}}));
        expectedPanel.add(ui.Label({value: 'Reference: ' + activeTestCaseRegion.reference, style: {fontSize: '11px', color: '#1976D2', margin: '0', fontStyle: 'italic'}}));
        resultsPanel.add(expectedPanel);
      }

      resultsPanel.add(ui.Label({
        value: activeTestCaseRegion !== null && activeTestCaseRegion.expectedHI !== undefined ? 'Calculated HI (from GEE):' : 'Calculated HI:',
        style: { fontWeight: 'bold', margin: '8px 0 2px 0', fontSize: '12px' }
      }));

      results.forEach(function(result, idx) {
        var stats = evaluatedStats[idx];
        var hiValue = stats.hi;
        var hiIntValue = stats.hi_int;
        var stage, stageColor;
        if (hiValue === -1 || hiValue === null) { stage = 'No Data'; stageColor = '#9E9E9E'; hiValue = 0.000; }
        else if (hiValue > 0.60) { stage = 'Young (Steep)'; stageColor = '#D32F2F'; }
        else if (hiValue > 0.35) { stage = 'Mature (Balanced)'; stageColor = '#F57C00'; }
        else { stage = 'Old (Eroded)'; stageColor = '#388E3C'; }

        resultsPanel.add(ui.Label({value: result.demName + ':', style: { color: result.demColor, fontWeight: 'bold', margin: '6px 0 0 0', fontSize: '12px' }}));

        var method1Text = '   M1 (E-R Ratio): ' + hiValue.toFixed(3) + '  (' + stage + ')';
        // Only show delta comparison for test cases with expectedHI
        if (activeTestCaseRegion !== null && activeTestCaseRegion.expectedHI !== undefined && hiValue !== 0) {
          var diff1 = hiValue - activeTestCaseRegion.expectedHI;
          var diffStr1 = (diff1 >= 0 ? '+' : '') + diff1.toFixed(3);
          var matchIcon1 = Math.abs(diff1) <= 0.10 ? '✅' : '⚠️';
          method1Text += '  [Δ=' + diffStr1 + ' ' + matchIcon1 + ']';
        }
        resultsPanel.add(ui.Label({value: method1Text, style: { color: stageColor, fontWeight: 'bold', margin: '2px 0px', fontSize: '12px' }}));

        if (hiIntValue !== null && hiIntValue !== -1 && hiIntValue !== undefined) {
          var stage2, stageColor2;
          if (hiIntValue > 0.60) { stage2 = 'Young (Steep)'; stageColor2 = '#D32F2F'; }
          else if (hiIntValue > 0.35) { stage2 = 'Mature (Balanced)'; stageColor2 = '#F57C00'; }
          else { stage2 = 'Old (Eroded)'; stageColor2 = '#388E3C'; }

          var method2Text = '   M2 (Integral): ' + hiIntValue.toFixed(3) + '  (' + stage2 + ')';
          // Only show delta comparison for test cases with expectedHI
          if (activeTestCaseRegion !== null && activeTestCaseRegion.expectedHI !== undefined) {
            var diff2 = hiIntValue - activeTestCaseRegion.expectedHI;
            var diffStr2 = (diff2 >= 0 ? '+' : '') + diff2.toFixed(3);
            var matchIcon2 = Math.abs(diff2) <= 0.10 ? '✅' : '⚠️';
            method2Text += '  [Δ=' + diffStr2 + ' ' + matchIcon2 + ']';
          }
          resultsPanel.add(ui.Label({value: method2Text, style: { color: stageColor2, fontWeight: 'bold', margin: '2px 0px', fontSize: '12px' }}));
        }
      });

      resultsPanel.add(ui.Label({
        value: '\n🧮 Methods: M1 = Elevation-Relief Ratio [Pike & Wilson, 1971]\nM2 = Curve Integral (Trapezoidal) [Strahler, 1952]',
        style: {fontSize: '10px', color: '#555', fontStyle: 'italic', margin: '5px 0', whiteSpace: 'pre'}
      }));

      resultsPanel.add(ui.Label({ value: '\n📚 Interpretation Guide:', style: {fontWeight: 'bold', margin: '5px 0 2px 0'} }));
      resultsPanel.add(ui.Label({ value: '• High HI (>0.60): Young (Steep)', style: {fontSize: '11px', color: '#D32F2F', fontWeight: 'bold', margin: '2px 0'} }));
      resultsPanel.add(ui.Label({ value: '• Mid HI (0.35-0.60): Mature (Balanced)', style: {fontSize: '11px', color: '#F57C00', fontWeight: 'bold', margin: '2px 0'} }));
      resultsPanel.add(ui.Label({ value: '• Low HI (<0.35): Old (Flat)', style: {fontSize: '11px', color: '#388E3C', fontWeight: 'bold', margin: '2px 0'} }));

      resultsPanel.add(ui.Label({value: '📏 Elevation Statistics:', style: { fontWeight: 'bold', margin: '5px 0 5px 0' }}));
      results.forEach(function(result, idx) {
        var stats = evaluatedStats[idx];
        var minStr = (stats.min !== null && stats.min !== -9999) ? stats.min.toFixed(0) + 'm' : 'N/A';
        var maxStr = (stats.max !== null && stats.max !== -9999) ? stats.max.toFixed(0) + 'm' : 'N/A';
        var meanStr = (stats.mean !== null && stats.mean !== -9999) ? stats.mean.toFixed(0) + 'm' : 'N/A';
        resultsPanel.add(ui.Label({
          value: result.demId + ':  Min: ' + minStr + ' | Max: ' + maxStr + ' | Mean: ' + meanStr,
          style: {fontSize: '12px', color: result.demColor, fontWeight: 'bold', margin: '1px 0'}
        }));
      });

      // ═══════════════════════════════════════════════════════
      // HARLIN (1978) STATISTICAL MOMENTS — per DEM
      // ═══════════════════════════════════════════════════════
      resultsPanel.add(ui.Label({
        value: '📈 Hypsometric Statistical Moments (Harlin, 1978):',
        style: { fontWeight: 'bold', margin: '8px 0 4px 0' }
      }));
      resultsPanel.add(ui.Label({
        value: 'Polynomial fit f(x)=a₀+a₁x+a₂x²+a₃x³ on normalized curve (51 pts)',
        style: { fontSize: '10px', color: '#555', fontStyle: 'italic', margin: '0 0 4px 0' }
      }));

      results.forEach(function(result, idx) {
        var s = evaluatedStats[idx];
        if (!s || s.min === -9999 || s.max === -9999) return;
        var moments = computeHarlinMoments(s.percentiles, s.min, s.max);
        if (!moments) {
          resultsPanel.add(ui.Label({
            value: result.demId + ': Polynomial fit failed.',
            style: { fontSize: '11px', color: '#999', margin: '1px 0 1px 4px' }
          }));
          return;
        }
        resultsPanel.add(ui.Label({
          value: result.demName + ':',
          style: { color: result.demColor, fontWeight: 'bold', margin: '5px 0 1px 0', fontSize: '12px' }
        }));
        resultsPanel.add(ui.Label({
          value: '   f(x) = ' + moments.a[0].toFixed(4) + ' + ' + moments.a[1].toFixed(4) +
                 'x + ' + moments.a[2].toFixed(4) + 'x² + ' + moments.a[3].toFixed(4) + 'x³' +
                 '   (R²=' + moments.r2.toFixed(4) + ')',
          style: { fontSize: '10px', color: '#555', fontStyle: 'italic', margin: '0 0 2px 4px' }
        }));
        var row1 = '   HI(poly): ' + moments.HI_poly.toFixed(4) +
                   '   |   Skew: ' + moments.skew.toFixed(4) +
                   '   |   Kurtosis: ' + moments.kurtosis.toFixed(4);
        var row2 = '   Density Skew: ' + moments.densitySkew.toFixed(4) +
                   '   |   Density Kurtosis: ' + moments.densityKurtosis.toFixed(4);
        resultsPanel.add(ui.Label({ value: row1, style: { fontSize: '11px', color: '#1565C0', fontWeight: 'bold', margin: '0 0 1px 4px' }}));
        resultsPanel.add(ui.Label({ value: row2, style: { fontSize: '11px', color: '#1565C0', margin: '0 0 2px 4px' }}));
      });

      resultsPanel.add(ui.Label({
        value: 'Skew>0: headward erosion dominant | Kurtosis>3: sharp midbasin peak  |  Density Skew: slope change | Density Kurtosis: midbasin slope',
        style: { fontSize: '9px', color: '#888', fontStyle: 'italic', margin: '2px 0 6px 0' }
      }));

      // ═══════════════════════════════════════════════════════
      // AREA BY ELEVATION BAND (client-side from percentiles)
      // ═══════════════════════════════════════════════════════
      resultsPanel.add(ui.Label({
        value: '📐 Area by Elevation Band (km²):',
        style: { fontWeight: 'bold', margin: '8px 0 4px 0' }
      }));

      (function() {
        var s0       = evaluatedStats[0];
        var pcts     = s0.percentiles;
        var totalKm2 = (s0.totalArea || 0) / 1e6;
        var areaStep = (range > 3000) ? 250 : (range > 1500) ? 100 : (range > 500) ? 50 : 20;
        var areaStart = Math.floor(s0.min / areaStep) * areaStep;
        var areaEnd   = Math.ceil(s0.max  / areaStep) * areaStep;
        var sliceArea = totalKm2 * 0.02;
        var nSlices   = pcts.length - 1;

        var bands = [];
        for (var lo = areaStart; lo < areaEnd; lo += areaStep) {
          var hi = lo + areaStep;
          var bandKm2 = 0;
          for (var i = 0; i < nSlices; i++) {
            var eL = pcts[i];
            var eH = pcts[i + 1];
            if (eL === -9999 || eH === -9999) continue;
            if (eH <= eL) continue;
            var overlapLo = Math.max(eL, lo);
            var overlapHi = Math.min(eH, hi);
            if (overlapHi <= overlapLo) continue;
            bandKm2 += ((overlapHi - overlapLo) / (eH - eL)) * sliceArea;
          }
          bands.push({ lo: lo, hi: hi, km2: bandKm2 });
        }

        resultsPanel.add(ui.Label({
          value: 'Elevation : Area (km²), Additive (km²), (%)',
          style: { fontSize: '10px', fontWeight: 'bold', color: '#555', margin: '2px 0 3px 0', fontStyle: 'italic' }
        }));

        var cumulative = 0;
        bands.forEach(function(band) {
          cumulative += band.km2;
          var pct = (totalKm2 > 0) ? ((band.km2 / totalKm2) * 100) : 0;
          var line = band.lo.toFixed(0) + '–' + band.hi.toFixed(0) + ' m : ' +
                     band.km2.toFixed(2) + ' km², ' +
                     cumulative.toFixed(2) + ' km², ' +
                     '(' + pct.toFixed(1) + '%)';
          resultsPanel.add(ui.Label({
            value: line,
            style: { fontSize: '11px', color: '#1565C0', margin: '0px 0px 1px 4px' }
          }));
        });

        resultsPanel.add(ui.Label({
          value: 'TOTAL: ' + totalKm2.toFixed(2) + ' km²',
          style: { fontSize: '11px', fontWeight: 'bold', color: '#1565C0', margin: '4px 0 2px 4px' }
        }));

        resultsPanel.add(ui.Label({
          value: '* DEM: ' + validDEMs[0].name + ' | Step: ' + areaStep + ' m | Scale: ' + validDEMs[0].scale + ' m',
          style: { fontSize: '9px', color: '#999', fontStyle: 'italic', margin: '2px 0 0 0' }
        }));
      })();

      statusLabel.setValue('✅ Results ready! Map layers rendering...');
      statusLabel.style().set('color', '#E65100');

      // Unlock UI only after the DEM visualisation image is also confirmed
      // by evaluating a lightweight server-side call on the clipped DEM.
      dem.reduceRegion({
        reducer: ee.Reducer.count(),
        geometry: geometry,
        scale: validDEMs[0].scale * 10,  // coarse scale for speed
        maxPixels: 1e6,
        bestEffort: true
      }).evaluate(function(countResult, countError) {
        setUILocked(false);
        statusLabel.setValue('✅ Analysis complete.');
        statusLabel.style().set('color', '#2E7D32');
      });
    });
  });
}

calculateButton.onClick(runAnalysis);

// ═══════════════════════════════════════════════════════════════
// UI LOCK / UNLOCK DURING ANALYSIS
// ═══════════════════════════════════════════════════════════════
function setUILocked(locked) {
  datasetTypeSelect.setDisabled(locked);
  datasetLevelSelect.setDisabled(locked || !currentWatershedFC);
  calculateButton.setDisabled(locked);
  clearButton.setDisabled(locked);
  if (locked) {
    calculateButton.style().set({ color: '#888', backgroundColor: '#EEEEEE', fontWeight: 'normal' });
    clearButton.style().set({ color: '#888', backgroundColor: '#EEEEEE' });
  } else {
    calculateButton.style().set({ color: 'black', backgroundColor: '#FFC107', fontWeight: 'bold' });
    clearButton.style().set({ color: 'black', backgroundColor: '#FFFFFF' });
  }
}

// ═══════════════════════════════════════════════════════════════
// SETUP UI LAYOUT
// ═══════════════════════════════════════════════════════════════

var controlPanel = ui.Panel({
  widgets: [
    title,
    instructions,
    ui.Label({ value: '───────────────────────────', style: {margin: '1px 0px'} }),
    demSelectionPanel,
    ui.Label({ value: '───────────────────────────', style: {margin: '1px 0px'} }),
    ui.Label({value: 'Quick Test Cases:', style: {fontWeight: 'bold', fontSize: '12px'}}),
    testCaseSelect,
    siteInfoPanel,
    ui.Label({ value: '───────────────────────────', style: {margin: '3px 0px 1px 0px'} }),
    ui.Label({
      value: '🗺️ Click-to-Analyze Watershed:',
      style: {fontWeight: 'bold', fontSize: '12px', margin: '2px 0px 1px 0px'}
    }),
    ui.Label({
      value: 'Select a dataset & level → layer loads on map\nClick any watershed boundary to auto-run analysis.',
      style: {fontSize: '11px', color: '#555', fontStyle: 'italic', margin: '0px 0px 3px 0px', whiteSpace: 'pre'}
    }),
    datasetTypeSelect,
    datasetLevelSelect,
    statusLabel,
    calculateButton,
    clearButton,
    ui.Label({ value: '═══════════════════════════', style: {margin: '5px 0px'} }),
    ui.Label({ value: '👉 Results will appear in the right panel.', style: {fontSize: '11px', color: '#666', fontStyle: 'italic'} })
  ],
  style: { width: '400px', padding: '10px' }
});

var map = ui.Map();
map.setCenter(0, 30, 3);
var terrain = ui.Map.Layer(
  ee.Image('USGS/SRTMGL1_003').select('elevation'),
  {min: 0, max: 3000, palette: ['blue', 'green', 'yellow', 'red']},
  'SRTM Elevation', false
);
map.add(terrain);

var drawingTools = map.drawingTools();
drawingTools.setShown(true);
drawingTools.setDrawModes(['rectangle', 'polygon']);
drawingTools.onDraw(function() {
  var layers = drawingTools.layers();
  if (layers.length() > 1) {
    for (var i = 0; i < layers.length() - 1; i++) { layers.remove(layers.get(0)); }
  }
  activeTestCaseRegion = null;
  testCaseSelect.setValue(null);
  removeLayerByName('TestCase_Box');
  removeLayerByName('ClickedWatershed');
  statusLabel.setValue('✏️ Custom region drawn.');
  statusLabel.style().set('color', '#1976D2');
  calculateButton.setDisabled(false);
  calculateButton.style().set({ color: 'black', backgroundColor: '#FFC107', fontWeight: 'bold' });
});

// ═══════════════════════════════════════════════════════════════
// MAP CLICK → FIND WATERSHED → RUN ANALYSIS
// ═══════════════════════════════════════════════════════════════

map.onClick(function(coords) {
  if (!currentWatershedFC) return;

  var clickPoint = ee.Geometry.Point([coords.lon, coords.lat]);

  statusLabel.setValue('⏳ Finding watershed at clicked point...');
  statusLabel.style().set('color', '#FF9800');

  var clickedFeature = currentWatershedFC.filterBounds(clickPoint).first();

  clickedFeature.geometry().evaluate(function(geom, error) {
    if (error || !geom) {
      statusLabel.setValue('❌ No watershed found at this location.\nTry clicking inside a visible boundary.');
      statusLabel.style().set('color', 'red');
      return;
    }

    var clickedGeometry = ee.Geometry(geom);
    var dsType  = datasetTypeSelect.getValue()  || 'Watershed';
    var dsLevel = datasetLevelSelect.getValue() || '';
    var regionLabel = dsType + ' – ' + dsLevel + ' (clicked)';

    // No expectedHI → validation comparison will be suppressed in runAnalysis
    activeTestCaseRegion = {
      name: regionLabel,
      shortName: regionLabel,
      region: clickedGeometry
    };

    drawingTools.layers().reset();
    suppressTestCaseChange = true;
    testCaseSelect.setValue(null);
    suppressTestCaseChange = false;
    siteInfoPanel.clear();
    siteInfoPanel.style().set('shown', false);

    removeLayerByName('ClickedWatershed');
    map.addLayer(
      ee.FeatureCollection([ee.Feature(clickedGeometry)])
        .style({color: 'FF0000', fillColor: 'FF000018', width: 2}),
      {},
      'ClickedWatershed'
    );

    map.centerObject(clickedGeometry);

    calculateButton.setDisabled(false);
    calculateButton.style().set({ color: 'black', backgroundColor: '#FFC107', fontWeight: 'bold' });

    statusLabel.setValue('✅ Watershed selected – running analysis…');
    statusLabel.style().set('color', '#1976D2');

    runAnalysis();
  });
});

// ═══════════════════════════════════════════════════════════════
// FINALIZE LAYOUT
// ═══════════════════════════════════════════════════════════════

ui.root.add(controlPanel);
ui.root.add(map);
ui.root.add(resultsPanel);

loadTestCase(testCases[0].name);

print('🌍 INTERACTIVE HYPSOMETRIC ANALYSIS TOOL (Dual Method: E-R Ratio + Integral)');

// ═══════════════════════════════════════════════════════════════
// BATCH STATISTICS TABLE — All Test Cases → GEE Console
// Runs SRTM (primary) for each test case and prints a summary
// table with published vs calculated HI and elevation stats.
// ═══════════════════════════════════════════════════════════════

(function() {
  var srtm = ee.Image('USGS/SRTMGL1_003').select('elevation');
  var cop  = ee.ImageCollection('COPERNICUS/DEM/GLO30').select('DEM').mosaic().rename('elevation');

  // Build one ee.Feature per test case with all relevant statistics
  var features = testCases.map(function(tc) {
    var region = tc.region;

    // Use Copernicus for regions outside SRTM coverage (>60N or <56S)
    // We use a simple lat-based check via centroid
    var centroid = ee.Geometry(region).centroid(500).coordinates();
    var lat = ee.Number(centroid.get(1));
    var dem = ee.Algorithms.If(
      lat.abs().gt(56),
      cop.clip(region),
      srtm.clip(region)
    );
    dem = ee.Image(dem);

    var percentiles = ee.List.sequence(0, 100, 2);
    var reducer = ee.Reducer.minMax()
      .combine({reducer2: ee.Reducer.mean(),       sharedInputs: true})
      .combine({reducer2: ee.Reducer.percentile(percentiles), sharedInputs: true});

    var stats = dem.reduceRegion({
      reducer:    reducer,
      geometry:   region,
      scale:      30,
      maxPixels:  1e9,
      bestEffort: true
    });

    var minE  = ee.Number(stats.get('elevation_min'));
    var maxE  = ee.Number(stats.get('elevation_max'));
    var meanE = ee.Number(stats.get('elevation_mean'));

    // M1: Pike & Wilson (1971) — Elevation-Relief Ratio
    var HI_M1 = ee.Algorithms.If(
      stats.get('elevation_mean'),
      meanE.subtract(minE).divide(maxE.subtract(minE)),
      -1
    );

    // M2: Strahler (1952) — Trapezoidal integral of normalized curve
    var range = maxE.subtract(minE);
    var points = percentiles.map(function(p) {
      p = ee.Number(p);
      var key  = ee.String('elevation_p').cat(p.format('%d'));
      var elev = stats.get(key);
      var yVal = ee.Algorithms.If(elev,
        ee.Number(elev).subtract(minE).divide(range), 0);
      return ee.List([ee.Number(1).subtract(p.divide(100)), ee.Number(yVal)]);
    });
    var indices = ee.List.sequence(0, points.length().subtract(2));
    var slices = indices.map(function(i) {
      i = ee.Number(i);
      var p1 = ee.List(points.get(i));
      var p2 = ee.List(points.get(i.add(1)));
      var dx = ee.Number(p1.get(0)).subtract(ee.Number(p2.get(0))).abs();
      return ee.Number(p1.get(1)).add(ee.Number(p2.get(1))).multiply(0.5).multiply(dx);
    });
    var HI_M2 = ee.Algorithms.If(
      stats.get('elevation_mean'),
      ee.Number(ee.List(slices).reduce(ee.Reducer.sum())),
      -1
    );

    // Total basin area (km²)
    var areaKm2 = ee.Image.pixelArea().clip(region)
      .reduceRegion({reducer: ee.Reducer.sum(), geometry: region, scale: 30, maxPixels: 1e9, bestEffort: true})
      .get('area');

    return ee.Feature(null, {
      'ID':          tc.id,
      'Basin':       tc.shortName,
      'Reference':   tc.reference,
      'Pub_HI':      tc.expectedHI !== undefined ? tc.expectedHI : -1,
      'Tier':        tc.tier,
      'Min_m':       minE.round(),
      'Max_m':       maxE.round(),
      'Mean_m':      meanE.round(),
      'Range_m':     maxE.subtract(minE).round(),
      'Area_km2':    ee.Number(areaKm2).divide(1e6).multiply(100).round().divide(100),
      'HI_M1':       ee.Number(HI_M1).multiply(10000).round().divide(10000),
      'HI_M2':       ee.Number(HI_M2).multiply(10000).round().divide(10000),
      'Delta_M1':    ee.Number(HI_M1).subtract(tc.expectedHI !== undefined ? tc.expectedHI : 0).multiply(10000).round().divide(10000)
    });
  });

  var fc = ee.FeatureCollection(features);

  // ── Table 1: Core hypsometric results ──────────────────────
  print('═══════════════════════════════════════════════════════');
  print('TABLE 1 — Hypsometric Integral: Published vs GEE (SRTM 30m)');
  print('Columns: ID | Basin | Pub_HI | HI_M1 (Pike&Wilson) | HI_M2 (Strahler) | Delta_M1 | Tier');
  print('═══════════════════════════════════════════════════════');
  print(ui.Chart.feature.byFeature({
    features: fc,
    xProperty: 'ID',
    yProperties: ['Pub_HI', 'HI_M1', 'HI_M2']
  }).setChartType('Table'));

  // ── Table 2: Elevation statistics ──────────────────────────
  print('═══════════════════════════════════════════════════════');
  print('TABLE 2 — Elevation Statistics per Basin (SRTM 30m)');
  print('Columns: ID | Basin | Min(m) | Max(m) | Mean(m) | Range(m) | Area(km²)');
  print('═══════════════════════════════════════════════════════');
  print(ui.Chart.feature.byFeature({
    features: fc,
    xProperty: 'ID',
    yProperties: ['Min_m', 'Max_m', 'Mean_m', 'Range_m', 'Area_km2']
  }).setChartType('Table'));

  // ── Raw FeatureCollection (downloadable as CSV via Tasks) ──
  print('═══════════════════════════════════════════════════════');
  print('RAW TABLE — click columns to sort, Export via Tasks for CSV:');
  print(fc.select(['ID','Basin','Pub_HI','HI_M1','HI_M2','Delta_M1','Min_m','Max_m','Mean_m','Range_m','Area_km2','Tier','Reference']));

})();
