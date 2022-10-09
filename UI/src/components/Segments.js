import React, { useState } from "react";
// import PropTypes from "prop-types";
import { Box, Tabs, Tab } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import SegmentMap from "./SegmentMap";

import SEGMENTS from "mockData/segments";
import { ApiGet } from "api/api";

const MyBox = styled(Box)(({ theme }) => ({
  height: "90vh",
  width: "95vw",
  maxWidth: "1000px",
  padding: 8,
  borderRadius: 4,
  backgroundColor: theme.palette.background.paper,
  display: "flex",
  flexDirection: "column",
}));
const MapBox = styled(Box)(({ theme }) => ({
  height: "30vh",
  width: "calc(100%)",
}));

const columns = [
  {
    field: "name",
    headerName: "Segment Name",
    flex: 4,
    renderCell: (props) => {
      const { value, id } = props;
      return <Link to={`${id}`}>{value}</Link>;
    },
  },
  {
    field: "effort_count",
    headerName: "Attempts",
    flex: 2,
    renderCell: (props) => {
      return props.value;
    },
  },
];

const CACHE = [
  {
    id: 1313,
    resourceState: 3,
    name: "First Casitas Pass",
    activityType: "Ride",
    distance: 4033.49,
    averageGrade: 5.5,
    maximumGrade: 9.3,
    elevationHigh: 288.1,
    elevationLow: 65.5,
    startLatlng: [34.395935, -119.4524],
    endLatlng: [34.388817, -119.413895],
    climbCategory: 2,
    totalElevationGain: 222.065,
    effortCount: 31755,
    athleteCount: 5296,
    polyline:
      "q}|pEppaxUhAib@Fw@X_B`@kAd@_AxHkLh@aAb@eAXaAPmALuADuACmAIgAeAwHUmCm@{SIwE@q@HcAdBsJN}@J{@DwAFuFPmCPaBFeA?i@GgAKiA?wAImA[y@iAsAWq@Aw@Pu@dBkB^s@Ro@Z}AFq@@u@CaADaAPa@d@c@XIj@?r@Hp@Bj@Od@[`@q@Ns@NiAToCDsBKiBIk@aAsDM}@Bo@Lm@^c@l@MhBBp@Sh@e@^q@Py@LqCLi@T]",
    kom: "8:16",
    qom: "9:45",
    surfaceType: "road",
  },
  {
    id: 1315,
    resourceState: 3,
    name: "Second Casitas Pass",
    activityType: "Ride",
    distance: 2143.17,
    averageGrade: 5.7,
    maximumGrade: 9,
    elevationHigh: 335.6,
    elevationLow: 212.6,
    startLatlng: [34.383842, -119.39861],
    endLatlng: [34.38622, -119.3811],
    climbCategory: 1,
    totalElevationGain: 121.607,
    effortCount: 28942,
    athleteCount: 5104,
    polyline:
      "_rzpEj`wwUMiRE{AQeBmEeUk@sByAqEKq@Bq@Zq@b@Ud@Af@T\\d@rAfDd@f@LFZFd@Cd@[Tq@@g@a@kD?qAJ_ADcAGcAS{@s@_Co@cCY{@c@s@_DwCo@y@g@eAYgAQmAC}@DaDIy@Sk@",
    kom: "4:30",
    qom: "5:50",
    surfaceType: "road",
  },
  {
    id: 618305,
    resourceState: 3,
    name: "Toro Canyon full",
    activityType: "Ride",
    distance: 3500.03,
    averageGrade: 10.4,
    maximumGrade: 62,
    elevationHigh: 446.2,
    elevationLow: 82.4,
    startLatlng: [34.427452, -119.574844],
    endLatlng: [34.454556, -119.561455],
    climbCategory: 3,
    totalElevationGain: 374.16,
    effortCount: 548,
    athleteCount: 259,
    polyline:
      "qbcqExmyxUu@Ka@Sc@i@Sk@SQa@Ke@SiAoA_B{@qA_A[e@][_@EWBk@A_AKYG_@ScAu@a@c@[e@Sc@a@e@_B_@}@M[I_@W]KyA]_@Hg@Zo@v@W`@YHgCcB_Bo@q@_@k@c@{A}As@m@sA_B{AuAwA_Bq@o@o@c@e@Q_@GUK]WQ_@Ok@OU[W_@S_A]eCw@w@a@g@Ok@Gc@OiAcA_Aq@]Qk@Qe@Kc@Ua@[c@u@U[gA}@gAo@SIe@[e@QQUw@a@mAe@s@e@e@MU?}@Ge@K_@AUG]Yq@oAg@g@s@iAQQcAkBYSGAMOe@Um@s@g@]I?OOWMSGo@Gk@?SHm@LOHaCh@e@ZGAe@Ng@\\UJ}@LSJ}@NOF[C_ABSCM@_@Aq@MQAQJa@FIFI@UAQBe@V",
    kom: "14:14",
    qom: "20:20",
    surfaceType: "road",
  },
  {
    id: 631703,
    resourceState: 3,
    name: "Farren Road climb",
    activityType: "Ride",
    distance: 3236.58,
    averageGrade: 4.8,
    maximumGrade: 15.3,
    elevationHigh: 161.6,
    elevationLow: 6.8,
    startLatlng: [34.438953, -119.92187],
    endLatlng: [34.4647, -119.922295],
    climbCategory: 1,
    totalElevationGain: 160.6,
    effortCount: 17719,
    athleteCount: 2157,
    polyline:
      "mjeqEtf}zUuAA[BeAAeC@k@G_AQO?MJERZ|@@RCd@Qx@SlAYt@WVOHQDc@Ew@c@][[SQG[@o@ToBdBMHQ@]GeAw@iDkDiCcCg@[i@GeAD_B@eBCWG]O}@o@YMcAGiATi@Z[ZUJs@FyCJmHb@s@LgCj@cDj@cAVqB\\e@VY`@Sh@[tAMXOJWFSCkBq@{@OY@kBZm@?MC]Og@c@[Qa@KYCc@Bk@Rg@Xo@PU?g@K}@K[?g@FIASG{AeAg@Sm@c@oAm@s@Q{COsCLe@?e@BYIkBSg@OaA]",
    kom: "6:59",
    qom: "8:30",
    surfaceType: "road",
  },
  {
    id: 637362,
    resourceState: 3,
    name: "Painted Cave",
    activityType: "Ride",
    distance: 5679.22,
    averageGrade: 7.1,
    maximumGrade: 87.5,
    elevationHigh: 848.3,
    elevationLow: 441.2,
    startLatlng: [34.491695, -119.79554],
    endLatlng: [34.5136, -119.79704],
    climbCategory: 3,
    totalElevationGain: 603.07,
    effortCount: 24633,
    athleteCount: 3110,
    polyline:
      "atoqEdqdzU]Q[Ew@@i@Ck@I[[ESEEQIMMIE}@USKCEABSICUJSDE\\KQPBJJAFE\\w@X_ARKp@H|@B^CJENMj@o@d@]PI`@Ir@?NAVM?KO]K_@McAYq@CM?QJ]Xc@LKz@_@TQBKAa@L[DYEEST_At@g@RcAZo@Hi@@MDGHD\\KPe@Tq@HGBa@d@{@v@YPM@BOPa@`AyAZw@Le@DGRIPSJUAIGIY@KCGECU@MN[~@s@^_@J]BWEEUPQFmAV_@BQMOWQQ_@Ks@c@HBH?ICI@CDBZDHVNl@|@FXGP]P}A`Am@Zi@PgADSDYTIBO@[GUMIKAQBYn@qBD[@eAAMEKMAm@Nk@@uBWcAYSFUNYFoA?m@CYEYKKIYi@KEOAq@?e@FQHg@h@E@Y?_ABT[@IKEBHXC\\MIBEI?KkBFiAMYIc@ASLUh@KNcAd@cA|@OHMCEMHs@Eq@?{@AWKUIE{@GOCq@e@YOkAUu@Ee@OEKWaAQYuAcAe@q@GEKAK@{Af@qAt@eA\\s@d@e@b@M\\DB\\CNJ@NCHi@^o@Xm@b@IBc@EOFKJCHi@~BMJYFEFCL?NDJNHp@Nb@MJMT_@JIf@Id@YLAXB^HTHz@j@^v@DL@NGd@Cn@Qn@c@z@o@n@{@l@MX_@vAOXY\\QLQFq@HKBKHS`@YhBIRwA`Bi@d@mAxAeAr@c@`@WLu@Ow@[[I{ACu@@MBiBf@_@@iAA_@BcAr@s@b@YD[L{@P{ANe@NMHQRQ`@Wx@",
    kom: "15:44",
    qom: "21:44",
    surfaceType: "road",
  },
  {
    id: 658277,
    resourceState: 3,
    name: "Gibraltar Climb",
    activityType: "Ride",
    distance: 9887.37,
    averageGrade: 8,
    maximumGrade: 25.3,
    elevationHigh: 1058.7,
    elevationLow: 268.4,
    startLatlng: [34.45181, -119.68905],
    endLatlng: [34.49128, -119.68999],
    climbCategory: 4,
    totalElevationGain: 804.057,
    effortCount: 68969,
    athleteCount: 11156,
    polyline:
      "yzgqErwoyU_IIsA`@IAmBo@o@?gBVy@Gs@Yo@g@EI]yAIGkBm@EKKeAQOM@m@Vu@EWVe@|@c@Vm@NeBGKBSFa@h@SLG?yBGw@}@GEWFy@h@c@@}A_@KG]m@qAi@EEGs@DI~@eATo@AIo@cAUs@?]\\_@fBk@DG@Ma@{@AWHYMo@c@o@Ea@Lo@FKbAk@BEDk@Og@iDeFe@[iA_@UUEKEw@DeBE]wAqBGW?QHM|@]zC?HGZk@F}APa@d@m@FE~C{@NONg@?ISs@IIkAGeBy@i@M_Ao@Yq@SSY@}A~@I@i@QY_@MGgBFk@[KQEMMoBs@cAaAq@Q_@AYHy@v@qB@g@MMI@a@T[?a@O{@cAIa@OwEIOUQm@GMLm@|BkAlCY?[k@}@u@CI?KBMl@k@XcA?]WmAN}AO_BEImAuAAK?aEMg@UEOV@zED\\dAvANh@G`AYvBQZqANGBYRY\\CHc@pCgAnBiA|AWj@@VNTjCl@\\Tl@l@l@TDFDTPtCI~AWXmA`@yBRo@f@gAMI@]\\i@hAEBOAy@c@MA_@PKZDdA]hAC~@X`@lAHF`@k@tAUNi@OEEiAaC{@cDEEOQKCgAEeATGFo@fBQhB}AdBu@|AGLW`Bk@r@s@XY?GACCe@wAm@w@EKOmAa@eASqA[aAKIUKQBa@HGDWXw@~AQHQ?Ue@KGSCE?QHa@f@g@Xe@Gm@_@_@AKFwAlBgAXEJ?dBQVkAX}CWI@cBpAwDPsCGuBe@sDsAeAOeANq@h@IVIn@Px@jDvB`@?v@W\\FbBtBl@Rj@Fv@p@b@z@p@p@Rd@FtAa@z@i@f@C?eA_@sB?e@OIGm@mAo@a@EAoBFiA?e@Ha@ZGTEd@F`A?XQN_A?GAy@g@u@GeBVcAj@eCVKFOZOx@MPmB@KBMJ]bAcAnBgAd@oBzAgAFSPQh@_@jCQhBQl@k@|@uB|Ac@G@C",
    kom: "27:12",
    qom: "35:05",
    surfaceType: "road",
  },
  {
    id: 751029,
    resourceState: 3,
    name: "Las Alturas Rd",
    activityType: "Ride",
    distance: 2098.24,
    averageGrade: 8.7,
    maximumGrade: 26.5,
    elevationHigh: 243.2,
    elevationLow: 61.4,
    startLatlng: [34.43324, -119.68137],
    endLatlng: [34.440933, -119.6831],
    climbCategory: 2,
    totalElevationGain: 202.37,
    effortCount: 4629,
    athleteCount: 610,
    polyline:
      "ufdqErgnyUFeA@wAJ_BX_BLkCRs@AOUOYNe@r@[l@Wv@UhAOd@U^]Da@Ec@?]RS`@W|@Sh@[HYOG[I}@QYQQSEYHw@r@UDUS_@_A]COXCN?VLbCANOd@a@b@i@v@Eb@VxAGn@[b@]Bc@UUe@SgAWuDAq@TyACGWIURQ`Au@vASh@GTCx@ZxAAp@Qj@YTUAKWDyA[mBQk@WGUN[d@k@Xa@^u@z@[Vc@PiATy@Xa@h@",
    kom: "5:27",
    qom: "6:46",
    surfaceType: "road",
  },
  {
    id: 813814,
    resourceState: 3,
    name: "Arroyo Burro to almost La Cumbre Peak",
    activityType: "Ride",
    distance: 4297.85,
    averageGrade: 6.2,
    maximumGrade: 18.3,
    elevationHigh: 1158.5,
    elevationLow: 890.4,
    startLatlng: [34.50545, -119.752686],
    endLatlng: [34.499016, -119.717636],
    climbCategory: 2,
    totalElevationGain: 274.144,
    effortCount: 13383,
    athleteCount: 2860,
    polyline:
      "ajrqEhe|yUU_@]w@Oo@Kw@@uALmA?u@G_AFgCV_Dn@wEJ_ABsBB[F}AFg@Nk@Vq@NQd@[DK?OIO{@MgBe@QMUYGYDWFI`@[JOHSHc@Dc@DcCA_@O]SOWCk@BMEm@[]WIQCSBUFOHMt@a@\\Mb@GRMn@cADSAa@GUQO]QGGEMAODMFM^_@Ve@La@AKESc@gAGUAa@Ba@JOb@QLMT_AD[C]Ie@Qy@[u@E]BU^c@FOEsADWBG`@a@H[C]WsAEy@Gk@@_@Ng@BSY{@EWCc@Ba@No@Vu@JQFEHALDf@\\TDVEfAe@LAT@zBz@^LPBRG^]PC~A\\d@Z^JTKd@Yt@aAJIDAF?HHTv@FLHJL@FAJMFQH[LsABaBN}A?MEYKQ[YIMEOEYFeAKy@?Wf@yBA[Ws@AM?QLe@D_@Ea@[sACs@w@cDE{@Dw@T_B@gBFU\\q@B[GSm@_ASo@WoA]uAKgA?]L_Ad@kAH[NmBR_Bh@}AXwAHWj@wAVa@x@w@r@c@NORa@lAeDRc@",
    kom: "12:10",
    qom: "15:48",
    surfaceType: "road",
  },
  {
    id: 1290381,
    resourceState: 3,
    name: "Official Old San Marcos Pass",
    activityType: "Ride",
    distance: 4794.08,
    averageGrade: 7.4,
    maximumGrade: 14.3,
    elevationHigh: 401.4,
    elevationLow: 46.4,
    startLatlng: [34.459343, -119.79538],
    endLatlng: [34.48975, -119.79607],
    climbCategory: 3,
    totalElevationGain: 355,
    effortCount: 93589,
    athleteCount: 4927,
    polyline:
      "{iiqEbpdzUaBR_ATSNu@dAy@|@UBs@I}CIoAOK?KBUNINg@lAYb@a@b@QVOb@U|@Q`@Kd@Gv@?pBE~@ITo@`AwA|A[Tc@L}@Ls@Xi@h@e@n@eBtAe@f@KRe@tAe@l@]VYHSBKAKEaAgAaAo@_A_BiAgAm@cAIGWKqAQe@O[Es@Jm@Va@^m@v@OVEXFfA@t@APGLKJMBM?o@Uo@GWBKDe@j@KDMAIEKSMs@k@_Bc@aAs@oA}@gAsAaAa@Qc@Ku@Ca@MIGQUIUKk@IQGIa@Om@GWOi@g@WIm@GQGGIM[I]Go@EkAIUGIa@My@Dg@OUE_A@SESMGQGk@KSUUSMm@SMOCKAMVm@DWAQM_@e@iAIKICS?Y\\Oj@Gf@GZy@~AK\\SbAWt@]n@SXYRUDW@kAKgEu@m@UMAM@OFKJ[Zs@fASHMAMEy@g@WIYCs@BSEe@OQ@KH?H@HVLf@LJN@RCHOLM@SAWGOOi@}@SQe@WiAe@k@Qw@c@I?GDCBCNBLHHf@\\XXHLCTQN]@WGi@Sk@e@ICOCm@CUGOKq@{@[WgAo@{Au@wA}@OGYCu@PQ?WK}@{@YO]EOBOFeAj@WJ",
    kom: "12:58",
    qom: "15:48",
    surfaceType: "road",
  },
  {
    id: 3596686,
    resourceState: 3,
    name: "Tunnel Pavement Full",
    activityType: "Ride",
    distance: 3103.47,
    averageGrade: 6.4,
    maximumGrade: 35.2,
    elevationHigh: 377,
    elevationLow: 179.7,
    startLatlng: [34.450375, -119.71048],
    endLatlng: [34.470005, -119.70593],
    climbCategory: 2,
    totalElevationGain: 249.66,
    effortCount: 11090,
    athleteCount: 1277,
    polyline:
      "yqgqEp}syU]Ca@DUAeB[KCQOWKYQe@MY@[Do@?_@Ba@?a@J]TYTWb@a@fAYf@QDg@Am@GuAFaCMS?s@H_@P_Bd@_BEi@IM@k@Tg@b@QHU@qAOUAWDSLOTMXQx@a@QCo@Fy@Ei@Uc@c@Ky@Cm@Tc@JoBRu@DQC]MMMe@aAKCO?]DO?qANkAPc@DYJKFu@p@WJa@n@QPm@Vw@Nc@ZU\\WTOVIHm@JONIBI@KEUg@USAO_@_AYi@McAK_@]a@i@c@K?i@`@}@Xi@KO?YFIHM@MEEW?eAHSNQNm@BWKmAGa@y@s@M?KBMJO@c@Ao@OSK@STk@Pq@DWAUQg@UYk@QQIEUBq@?WIMc@a@a@IKIKc@E_AIMKBe@`@eAj@c@^]BG]D[Vo@FUDq@Fc@AOUs@KKMAe@F",
    kom: "10:43",
    qom: "14:54",
    surfaceType: "road",
  },
  {
    id: 5106261,
    resourceState: 3,
    name: "Casitas Climb",
    activityType: "Ride",
    distance: 7121.4,
    averageGrade: 2.8,
    maximumGrade: 29.3,
    elevationHigh: 351.2,
    elevationLow: 151.8,
    startLatlng: [34.41267, -119.3603],
    endLatlng: [34.38608, -119.38165],
    climbCategory: 0,
    totalElevationGain: 503.9,
    effortCount: 40453,
    athleteCount: 8720,
    polyline:
      "ef`qEzpowUvBv@dBrAnAdBv@nBb@zB|ChUrAbJNp@j@bBx@xAhAhAnAt@vAb@dBP`AEfB]dBy@hAcAn@{@hD}Fp@oAf@oAj@eB`@aBJ[@BDQ^{Bn@aDH_@Vu@n@sAnNoWdEaIxA{BlHcI~EuFdAgAnAcA`Aa@vAKnAJlAh@jAdAp@pAzF`Oz@dBhBlC~FhHz@x@rAr@fARfABdBY~CgAdAYbAKbAFlA^v@f@r@z@f@jAZxAFbBKzAUbAc@dAs@|@{@n@eCtAcAv@u@z@u@pAg@dAI~@Dl@h@|BDz@It@u@xCOdAEjACvCA~ELbCLlAL~@f@vBHv@?`AMfA}@fEy@zMYlA]v@w@~@kAnA]j@c@fBEv@Hv@Rt@\\l@dClCp@b@z@Jl@Ip@Qx@I\\BNFZLVT^x@FZ@l@",
    kom: "12:25",
    qom: "14:10",
    surfaceType: "road",
  },
  {
    id: 12039079,
    resourceState: 3,
    name: "Sycamore Coyote",
    activityType: "Ride",
    distance: 3578.2,
    averageGrade: 6.2,
    maximumGrade: 15.6,
    elevationHigh: 236.4,
    elevationLow: 12.2,
    startLatlng: [34.4293, -119.67721],
    endLatlng: [34.453896, -119.668915],
    climbCategory: 2,
    totalElevationGain: 228,
    effortCount: 1137,
    athleteCount: 275,
    polyline:
      "cncqErmmyU{@UwCc@qAAmCHYIWOw@eAWOs@OiAMaBa@cBm@WCa@Ao@Nk@h@_@RwAd@c@DcBa@KAcAD[AsAc@]CgEXo@@yAEe@Kq@o@e@UwBk@[C]@ODiAh@OBOCKKIKAKBoAIc@IKMGOAi@B}ARc@CUMGI]o@g@]ICa@E}@CIEMQYkAQ]m@u@c@a@e@q@Sc@SaAOyAAc@Jc@x@{AXcABYAIa@s@[[_@OWG]AWJUTIRKd@I|ACLMXMLc@PiBByD?w@DmAN_AC]EoA]c@S{E{CgCcAc@ISAa@?UBOHSNMVMZSz@U^WPe@LgCEa@GYIe@QeAi@a@c@MYIq@Ba@FYn@kAF[BS?SC]ESOYMOWOOGQ?e@BQFKLQX",
    kom: "9:57",
    qom: "14:24",
    surfaceType: "road",
  },
  {
    id: 29015105,
    resourceState: 3,
    name: "Roundabout to Mtn Drive",
    activityType: "Ride",
    distance: 4693.1,
    averageGrade: 4.6,
    maximumGrade: 13,
    elevationHigh: 242.2,
    elevationLow: 25.8,
    startLatlng: [34.423325, -119.65151],
    endLatlng: [34.453667, -119.65698],
    climbCategory: 2,
    totalElevationGain: 216.4,
    effortCount: 801,
    athleteCount: 391,
    polyline:
      "whbqE~lhyUy@uA{BiEmAcBq@gAiAoA}@w@kDiBuC_CiAw@YUe@k@iAmB}@kBW_AQiBMc@Ci@AGICI?UNmAf@_HzBWBc@AeAWk@ScAMi@Dm@Z{AzA]T{@TUESNy@\\eDpB}At@g@^s@v@UPq@r@_@ZYb@[XENGFSN_B|A[b@q@fAg@n@cCdCaAz@cAx@]`@e@bA@JOvBKt@KVORO`@ElAq@nJAr@I`A@j@MjC?fAIjAGZENMnAAXa@lGENGFS@{Ae@kAS{Cc@wC[oB[oEi@aBIa@A{AKg@A}DUmBCk@Is@Eg@FSJ]HQLWDUAWOe@g@We@Sq@a@w@WY[USAI@o@`@[Hu@CeADi@?aAEM@KCSKe@a@[Oi@a@uAy@QWi@kAUQKEK@ID[\\KV[pAO^Mn@",
    kom: "11:59",
    qom: "15:35",
    surfaceType: "road",
  },
  {
    id: 641588,
    resourceState: 3,
    name: "Refugio Cyn Road to Santa Ynez Peak (to asphalt end)",
    activityType: "Ride",
    distance: 20012.3,
    averageGrade: 5.8,
    maximumGrade: 35.4,
    elevationHigh: 1196.2,
    elevationLow: 26.3,
    startLatlng: [34.468327, -120.06869],
    endLatlng: [34.53036, -119.989555],
    climbCategory: 5,
    totalElevationGain: 1189.67,
    effortCount: 1441,
    athleteCount: 717,
    polyline:
      "_bkqEh|y{UcA`@gA^q@BqBWw@@_@FiA^a@Fc@G[Is@i@q@cASSu@_@k@CkFnAaADi@K_Ao@q@k@uAq@oAc@wBg@}DeAq@Mk@?}@Xo@?gFuAwFuAoHmAkBa@{N}DmOsE}DiAs@LwA~As@^yC^MDcAv@oA`BgAjBq@p@c@LM@wACcD[aBGwAKm@Be@LkAl@kA~@QJk@HsA?YBy@Va@HW@mBQeAUmA]sAKoAG{@JgAX}ATqAXSBeAI}Ak@kA[uAI_@KaDuB{@MeBToACgCe@i@EgAJg@CsAc@UMa@g@Km@?_@Es@YYc@FYJ[To@XeBjA]@o@Nq@d@_B`@[Rc@bAWfAI~@Bl@?zBZtA[z@g@^_Ad@c@Zm@bA[Le@?aB]oBE_BD_@JC@BTRLv@Rd@\\RPL^KZ]h@]pA{@dAUh@]l@KT?h@Pz@C`@uAt@IZCp@Of@If@BJRRj@ZRd@CZw@b@Qh@NX\\`@?vBu@pBWNSKEOR}@?UO_@]][MKUHeBAq@][_@c@Ac@D{@QeDMw@?w@Iu@Qo@MOQL@HPn@B`AK`DEHUCGYEkCO_A}@iB]MWLCV`@rAAXg@jB[vBSf@[Z[Fa@@c@Jm@Fi@I]@SVL`AW`BKlAI\\Yd@Mj@BnCQhAOV_AdAWf@[^_@^m@ZqAb@YZi@dAC@OCW_@i@eBWk@[e@Ug@ScBo@{AYMQJSl@I`@Af@G^SBu@m@g@i@]OU?]I]Wc@eAYKi@GoAa@{@?YQB]\\k@Em@Qk@SOUAUOI]@s@Ai@UsAUe@e@e@e@UYc@a@W[]Ou@Qu@Uc@Ia@Lc@Zk@b@_@^STc@j@kBFc@K[s@WWe@Um@@i@Ra@f@i@Vm@IWe@Ea@Ic@Y[_@c@UwB@i@G_@Oc@a@S_@OEWJa@f@e@TECs@}AAa@Mi@_@SaB]aBOe@Sk@I]LU^UvAUJcAg@k@G_Am@a@Ec@M}@eAg@Ko@Lo@DKQ?[Dw@Oo@K{@Sy@?s@NgAIm@UG_@Je@@IWFk@BgAYc@MKs@]oASu@Qq@_@GOFoA@yBDQVk@f@o@n@cA|@kCEm@YMm@Cu@M{@Uq@a@i@e@g@YoBm@k@I[Q_@w@U_A@k@T{@Xs@n@SZU^_@r@YTSJg@EoANwARg@JOhAcAT_@Jm@O_@}@o@KQQkBYw@_@Wq@?{@\\s@RcA?[UUk@Iw@]i@i@_@_@g@c@g@o@Yc@ASMU{AM_@I]Cu@FcAT]f@Kf@AP]Rw@Bi@Hm@\\_@XqBMU[MW]Ea@Hs@b@kCVw@Vk@Ls@RUb@]Te@Bg@OiBD}B?_APs@BCXFl@XXGZc@`@a@Zo@V}@NcAr@_BTy@|AiD?m@UcA@g@Ni@Xk@z@mAPi@Xo@^On@Eh@Kz@cA^w@jBwAf@_A^c@^q@Ri@`@e@l@e@TYDk@YwCLk@Tg@XeA`AaBCa@SKmA`@WPUh@U`@g@Tm@Ho@@]?a@Ec@Re@HmAg@[eA]Oi@Gc@Em@Nu@f@e@To@CWUK[E_A?{@IcAEqA`@qBMsAHm@h@u@LiAR{@ZU\\c@Bo@O]e@g@Ms@Bq@H_ABiAJk@`@kAF[h@cAHo@QcAkAe@Wo@GYV_CH}@@s@GQMq@AUMs@O]Oo@Wi@QOW{@Ji@VeAVa@j@a@j@q@bBaB|@}Bx@k@Vu@F_BE}@[oAMoA_@aAa@[k@[Ys@LwDh@qCh@uBbCeHpA_Ch@s@`@cA~@}Ad@mBb@i@j@_@Zm@VqBNy@Rm@\\k@j@k@\\s@j@y@Vq@J{@r@yETcAh@Y^_@Zo@Lk@FsHCc@a@}AKuAQk@QWS_@Kc@EaA?w@NeCIYe@]qAkBY]M]a@iBsA_BQ[G_@?q@Fu@C}ASw@MeAMe@{@_CE[GoAOk@MUa@cAMa@e@iE_@wDE{@Hm@z@kD`@yAh@sADm@?oCPoDGCBNBCAABI?c@",
    kom: "58:14",
    qom: "1:21:33",
    surfaceType: "gravel",
  },
  {
    id: 647251,
    resourceState: 3,
    name: "Romero Canyon",
    activityType: "Ride",
    distance: 9808.27,
    averageGrade: 6.8,
    maximumGrade: 1428.6,
    elevationHigh: 933.6,
    elevationLow: 269.6,
    startLatlng: [34.453266, -119.590706],
    endLatlng: [34.470955, -119.60104],
    climbCategory: 4,
    totalElevationGain: 664,
    effortCount: 13505,
    athleteCount: 2991,
    polyline:
      "{chqE|p|xUSROXe@Nc@\\OHWPYJ[PW`@UF{@p@ULc@HQJQFILOFWEm@Fg@Aq@f@s@?QHMLUH[EOSAM@c@A_@EMO]i@u@_@]o@e@IKGOBQPU^ONCF?lCp@p@l@nAp@AOBUFc@FM`Aq@DM@e@H[NOZEHEBK?g@DUPSd@SDGFSEm@GKe@c@Ik@?WHa@JOXYFS?KEK[i@IUAQBQJQt@w@LCb@BPCLKDOAO][Qe@C]@aAC]KQYSIQAMBc@Km@AWF[?g@BSFIHEh@A^KXO^_@LER@ZRNBh@CJDXPLD|@QHEDK@SIY{@y@c@g@GYCi@@OHSb@YXW\\WTYDICSMO_@GUKk@c@e@IQKWe@ESD[Rk@A@Ae@EMUS]Q]IOKGWA_AEOIMIGOAi@HQE]w@e@m@Uk@KQQM_@KU?KFMNQ\\It@KNQNGVKJGBICe@k@GCOAQHGRGj@IXa@hAK~@MLq@L]VYb@MZERI~@IVc@h@ONy@RMHGTGd@KZSJ[DSCe@WUASJW`@EBOCUHK?AGC?I@ULs@v@a@ZGX@LFV`@x@d@`@`AfAFTAVIV_@b@g@|@Yx@MJWHIFKv@@f@H`@AVEJONaB`A{@l@GBSAQMi@mAOQmAm@u@Qs@c@O@MLIPKpBARGNKJ_@JUVURGNUTAjAK\\CRENEBO@]A[EgAaAOEW@OJS`@IJIBW?I@SRQTWRYH}@^MJOROFc@D]F_@R_@VK@SK[e@a@OSAY@q@Ii@?QGo@e@YIS?yAHc@GIGMSG[?[Hy@QaA@i@Ag@@k@OqACgAIMGEQCM@GAKG_@a@MEG@KJCPDRR`@BXE^M^k@r@Wf@SNWFs@QO@KHAPFZBh@NrAGx@L`A?PCRSTWF{@Uk@G]IG?IBARXpAB^E\\[l@APBp@CNQTw@l@]f@SD]AGDERAl@Yz@a@\\kAp@GJ@J^^v@b@VRJTHbADFFBNC`@YGM@?PCr@C`@Ib@Y^e@NINCHDFFZbBAVMf@?RBLVl@Bd@C\\Mf@[dCIRSXIRB|@BDDBR@`@E|@DTH`@Z`@RHDLAT]L[CcAHc@h@aAJMVOHQV{APq@TUHCJAJBFHPfAXx@X^f@Xb@HnA?PD\\RHBJ?ZMLBj@RZh@d@RTFR?r@KPB\\P\\DDA?KPA^GR@JHVl@VTf@Tn@b@t@FTJ^l@X\\BJAHINi@f@ENIfAKVMJOB]?i@FMHGHCXJtAAREH_@P_@j@GRBVJ\\f@lAZRFJJf@FRJFn@FNHFJNh@\\TPTFPBb@DHHDh@?p@Fj@@RDNJRVFRBVEXENGFa@P}@n@ODi@LUJuA~@[Jw@Ck@JY@QH[DOHe@j@Qf@MPOHm@POJu@n@g@|@QP[J]@OCIEQYI[IcAYy@C_@IoBTmCCS]{@MUECKAg@Pg@@ONKz@KRIJSDiBHWFOJa@`@g@p@IDI@GAGOQeA[{Ai@aBMSWWs@g@",
    kom: "36:01",
    qom: "46:12",
    surfaceType: "gravel",
  },
  {
    id: 746977,
    resourceState: 3,
    name: "Angostura Pass",
    activityType: "Ride",
    distance: 9488.92,
    averageGrade: 5.6,
    maximumGrade: 81.5,
    elevationHigh: 1019.7,
    elevationLow: 490,
    startLatlng: [34.522297, -119.67752],
    endLatlng: [34.498825, -119.69869],
    climbCategory: 3,
    totalElevationGain: 645.577,
    effortCount: 3055,
    athleteCount: 624,
    polyline:
      "isuqEnomyUl@DZGNGHAHBVN\\j@f@Xf@LHP?NG`@Gp@Th@VXJ?HG\\s@He@DKHKVSL?LDTPLDXCVKL@b@`@TNJ@JCROLELAVNL@LEr@Gv@q@l@]n@e@VKLD\\n@H\\?JWt@Ub@JFn@?|@RV\\^x@FXZh@LZBZCRK^SxA_@dAKS@IDF?JFLb@T^h@PPH?HE\\]^i@Ta@`@g@^a@VQHINWv@_CJQNAHBLR\\\\RJ|@?|@Rv@Hd@OfAUTKROTe@JIh@OHEvAqAJM@IAUQ]@QFQVe@D]Cg@@_@RQPEVSJQXyAHo@Bw@Nc@ZYrAc@^Cp@?p@EZGZQj@y@He@?YSmADm@R}@RsAN_@NOv@c@TaAb@eAb@a@j@M^Cn@@pA[\\ODm@O[Me@Ds@Au@Be@`@_@\\Cf@c@?qBHgAEq@a@eAUeAHw@Te@jA}ARM`@EjAFb@A`AVRTN^Hz@E\\W|@CP@VHPHFZPP?JOTi@T]b@e@LGJCPDFH@RCn@FJL?l@IH?LHDTEv@?tAMjAA\\BNPT\\LJH^|AZn@PL`@Lf@DlAELHHZFz@DVLPf@f@RDLE^YPCzAQTFHV@P@hBDNHFHBR?LMFURe@NQJILERB\\Tr@A^`@bAb@TANOFKFY?gADQFMTMh@QRWZm@JMXIh@ER@FT@NCXIf@Q^GXMfBOtA@TFh@APYhACT@NHPbAx@Xb@h@XDHHVBX?^EN_@r@SVSJK@a@Ca@?uBJIBKFc@d@]PIBcAGIBMP?LFPRJp@DJFl@x@FTBZCd@@VFR`@j@d@v@DTFx@Hb@^`Ab@v@HHJ?\\OJ@NJNfALb@HJ|@p@j@VJR?VCJa@\\QHg@FULMNAPLx@@TCh@AjBKh@WTMDGIWk@U[k@k@Sc@QU_@Wk@Oi@UOBMFa@^MFG?MEUUKCWBMFcAx@Oj@Gh@[|AAN\\pAXbBJVf@l@DLFd@?n@D^Vp@TtALVJn@Jb@Bf@KRKB{AOaAD]AiASMKICQDSTENDh@Bz@PZLd@?XINIHo@VSJe@b@[HQ?e@I{@G_@QOAYFIFELE\\[n@Oj@w@rAGRAPLl@d@r@n@Z`@Ht@K\\BNFZ\\d@~@?`@Md@w@lAy@x@GXBJHLr@l@h@r@n@j@JN@JE^OZOP[v@Gj@BTHPPBHAbAQb@SVG\\Cj@KV@`@CXMTSj@URCh@Zb@^^RVDL@Z[HALDb@d@FRBVUp@ATDdAPh@?TGLMJYFWAe@Jg@NIL?RLj@Hr@XfAC`@KP_AhAOZCLBNb@|@BLA`@ELeAf@YTOXAN?PHLtA|@VHVBZHn@`@l@R",
    kom: "31:27",
    qom: "42:46",
    surfaceType: "gravel",
  },
  {
    id: 2622235,
    resourceState: 3,
    name: "Arroyo Burro - River to Drop In",
    activityType: "Ride",
    distance: 8538.82,
    averageGrade: 6.9,
    maximumGrade: 34.2,
    elevationHigh: 907.2,
    elevationLow: 314.6,
    startLatlng: [34.539505, -119.76134],
    endLatlng: [34.50814, -119.75487],
    climbCategory: 3,
    totalElevationGain: 592.6,
    effortCount: 2980,
    athleteCount: 848,
    polyline:
      "{~xqEj{}yUv@E\\IPD@HBAHDl@p@FXFNTnAPTVPf@N\\DdAAD?RMFWBaAYmB@aAEs@JeAJOv@m@JSFoAGcAMu@B}@Ha@^i@^[v@e@XEP?^FPDLJJ@ZETAZEdAERCp@Ul@Cd@F\\B|@PrALh@\\LLXHN@RIPMR_@\\_@f@w@VSXOTEf@ERIxAIr@K`@@r@GV?TE^?z@LLAJIlA{ADMB[Sq@WeAGKOISWIe@Lg@LQXURk@J]@KKUOKY@_@J_@GYSMCYDa@`@GBWAGE_@i@KGG?SRIBQE[SU?QJWTc@NICMWHWNOHEx@Gn@SRYVK\\BN?NEFEx@iARa@\\iAB}@Ne@n@aAV[Vg@^i@f@[FAJMHOJg@P]HCHD^t@x@ZJJFXKZAPF`@f@|@Th@Lh@ZTP^`@l@J`@D\\Az@BPd@dAPTLTCXMNGV@VJ`@LPHFRAHG^a@N[Pw@Zg@\\Ul@EPE\\UPWfAeCT}ATkAHcAAg@Es@Mu@s@}Be@cAOk@G_@@c@Tw@P_@NMlAe@ZQJKVw@LOHCP?FFDHHl@Nd@h@l@X^xAj@PJFP@~@Ld@d@bAAd@Od@C`@F`@LNHRFvALj@Cl@D\\Rl@R\\J`@HnACr@H\\JLND^?ND^NV@RCNENOh@S\\Ej@Ql@ORBTRBHBPBFC?LTPv@NhAVb@XHdAPPEp@eAPu@NUJGZINSJq@A}@U{AAu@]{@c@y@[_@u@]EQASMe@SSQCc@SKIe@{@QSSKMe@IMGEKBe@Ry@Ru@\\S@KGCGA[DkCD_@Nc@JM\\Mb@AXEXBNFt@~@TJVNDL?VDLR`@PN`@PNBJ?NG^c@LEVAJHBf@PZPPl@jAJFJ?JM@KGM_@]GM]}@Qw@GMUUa@K]]K[CQD]As@BUBIRGHDFP@FCf@BVJPLFPB^J^?RBPJVRr@t@NTzBzB~@n@\\d@ZVHLt@h@Rz@^l@VVZVJJJPFVDH^^L?NMHk@Aa@S}AJmAJi@Bi@A[K{@Ao@BMP[PMRY@]A{@Ji@LMZDj@b@t@ZPXl@xAr@r@X@JE\\CJDPPPXDV?h@Dl@Pb@RTTFR?XJFLPx@PXDB^?RI\\WPQR[XQF?PDRALEd@]^_@JQPKFAd@ZTDZB^LFDBNGZDz@?ROr@HPX^l@Lp@Fd@XN?DB?ZCLe@b@Sp@GBEJBZRR|@HRHTJPDXGPMJAH@FDPXF\\JNNFf@d@b@JV@",
    kom: "33:30",
    qom: "41:25",
    surfaceType: "gravel",
  },
  {
    id: 881465,
    resourceState: 3,
    name: "Ladera Lane",
    activityType: "Ride",
    distance: 1384.38,
    averageGrade: 10.9,
    maximumGrade: 13.4,
    elevationHigh: 300.8,
    elevationLow: 149.8,
    startLatlng: [34.43667, -119.579285],
    endLatlng: [34.44914, -119.57927],
    climbCategory: 1,
    totalElevationGain: 151.052,
    effortCount: 21833,
    athleteCount: 3623,
    polyline: "c|dqEpizxUmGCsMD_CEu@BoACaHBeDCcLBmFAgBBiDEiB?",
    kom: "4:23",
    qom: "5:47",
    surfaceType: "road",
  },
];

const Segments = () => {
  const [tabVal, setTabVal] = useState("road");
  const [allSegments, setAllSegments] = useState([]);
  const [segments, setSegments] = useState(SEGMENTS);

  const handleTabChange = (event, newValue) => {
    setTabVal(newValue);
  };

  React.useEffect(() => {
    console.info("Get Segments");
    // ApiGet("api/segment", setAllSegments);
    setAllSegments(CACHE);
  }, []);

  React.useEffect(() => {
    let filterFunc;
    if (tabVal === "road") {
      filterFunc = (s) => s.surfaceType === "road";
    } else if (tabVal === "gravel") {
      filterFunc = (s) => s.surfaceType === "gravel";
    } else {
      filterFunc = () => true;
    }

    setSegments((seg) => allSegments.filter(filterFunc));
    return () => {};
  }, [allSegments, tabVal]);

  return (
    <MyBox>
      <MapBox>
        <SegmentMap segments={segments} />
      </MapBox>
      <Tabs
        value={tabVal}
        onChange={handleTabChange}
        aria-label="nav tabs example"
      >
        <Tab label="Road" value={"road"} />
        <Tab label="Gravel" value={"gravel"} />
        <Tab label="Show All" value={"ALL"} />
      </Tabs>
      <DataGrid
        rows={segments}
        columns={columns}
        hideFooter={true}
        initialState={{
          sorting: {
            sortModel: [{ field: "name", sort: "asc" }],
          },
        }}
        sx={{
          boxShadow: 2,
          border: 2,
          borderColor: "primary.light",
          "& .MuiDataGrid-cell:hover": {
            color: "primary.main",
          },
        }}
      />
    </MyBox>
  );
};

Segments.propTypes = {
  // prop: PropTypes.string,
};

export default Segments;
