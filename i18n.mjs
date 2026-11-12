/**
 * Trilingual (zh / ja / en) dictionary and verified statistical constants
 * for the 4-chapter Information Entropy & 3-Layer Gaze Terrain slides.
 */

export const METRICS = [
  {
    key: 'eg',
    symbol: 'E_gain',
    control: 0.5849,
    intervention: 1.3319,
    pct: '+127.7%',
    pText: '3.12e-8',
    dz: '3.46',
    significant: true
  },
  {
    key: 'eta',
    symbol: 'η',
    control: 1.0831,
    intervention: 1.4073,
    pct: '+29.9%',
    pText: '0.0041',
    dz: '0.98',
    significant: true
  },
  {
    key: 'ng',
    symbol: 'GTE_norm',
    control: 0.2473,
    intervention: 0.3000,
    pct: '+21.3%',
    pText: '0.0424',
    dz: '0.63',
    significant: true
  },
  {
    key: 'ns',
    symbol: 'SGE_norm',
    control: 0.6016,
    intervention: 0.6694,
    pct: '+11.3%',
    pText: '0.1523 (n.s.)',
    dz: '0.42',
    significant: false
  }
];

export const DICT = {
  zh: {
    pageTitle: '信息熵与三层眼动地形',
    navTabs: [
      { id: 's1', num: '01', short: '问题与目的' },
      { id: 's2', num: '02', short: '分析方法' },
      { id: 's3', num: '03', short: '结果 · 地形' },
      { id: 's4', num: '04', short: '讨论与结论' }
    ],

    // Slide 01: Problem & Objective (Merged)
    s1Kicker: '01 · 问题与目的',
    s1Title: '为什么“看了多久”不能说明“真正读懂了哪部分”？',
    s1ProbHeading: '传统分析的问题 (N = 13)',
    s1ProbTip: '来自植物园 297×210 mm 对照 (A1/B1) 与共创标识 (A2/B2) 的 N=13 配对实验。总时长不变而文本占比骤降，传统时长指标无法做出解释。',
    s1DurLabel: '总注视时长 (Control → Co-created)',
    s1DurVal: '33.11 s → 35.24 s',
    s1DurMeta: 't = 0.386, p = 0.707 (无显著差异)',
    s1DurNote: '同样看 30 多秒，停留时长均值掩盖了注意力到底落在高信息区还是漫无目的扫视。',
    s1ShareLabel: '解说正文注视占比',
    s1ShareVal: '44.34% → 18.09%',
    s1ShareMeta: '−26.26 pp, p < 0.001',
    s1ShareNote: '单纯看占比下降，无法区分读者是“中途放弃阅读”，还是“跳过冗余、精准提取了核心信息”。',
    s1GoalHeading: '为什么引入信息熵 · 本研究目的',
    s1GoalTip: 'E_gain 与空间耦合 C 基于预设 AOI 信息权重刻画认知指向代理，需与阅读后测结合验证。',
    s1GoalSteps: [
      {
        num: '01',
        tag: '理论依据 · 先前研究',
        title: '用信息熵与惊奇度揭示注视背后的意义',
        desc: 'Shannon 信息熵与阅读研究 (Hale 2001; Levy 2008; Shiferaw 2019) 表明，注视落在高信息量 / 高惊奇度区域反映更高的认知加工价值，能进一步阐释注视点与停留时长的真实含义。'
      },
      {
        num: '02',
        tag: '分析转换 · 从时间到结构',
        title: '把注视时长映射到信息分布与空间结构',
        desc: '结合宏观眼动熵 (SGE / GTE / E_gain) 与三层空间地形耦合，区分“低效滞留”与“信息驱动的高效阅读”。'
      },
      {
        num: '03',
        tag: '最终目的 · 精准识别吸收区',
        title: '明确版面中究竟哪一部分被真正加工和理解',
        desc: '定位访客真正集中加工的核心区域与被忽略的高信息文本，找出“看了却没看进”与“精准吸收”的空间差异，指导标识再设计。'
      }
    ],

    // Slide 02: Method
    s2Kicker: '02 · 分析方法',
    s2Title: '宏观熵指标与三层空间地形的双重建模',
    s2MacroHeading: '配对眼动熵指标 (N = 13)',
    s2MacroTip: 'E_gain 中的 q_AOI 为预设分区权重（核心 0.75 / 对白 0.12），非被试实测先验。',
    s2MacroItems: [
      { sym: 'SGE_norm', desc: '归一化空间凝视熵 —— 刻画注视在版面网格上的空间分散广度。' },
      { sym: 'GTE_norm', desc: '归一化转移凝视熵 —— 刻画 AOI 之间跨区跳转的路径复杂度。' },
      { sym: 'E_gain', desc: 'Σ (p_AOI · −log₂ q_AOI) —— 依分区惊奇度加权的视觉摄取代理。' },
      { sym: 'η', desc: 'E_gain / 有效注视时间 —— 单位时间内的加权信息获取速率。' }
    ],
    s2TerrainHeading: '三层地形场流程 (297 × 210 mm · 112 × 80)',
    s2TerrainTip: '裁剪右半标识区 (x: 44–96%, y: 3–97%)；间断 > 100 ms 不计入；C 为探索性空间乘积，不等同 η。',
    s2Layers: [
      { cls: 'info', title: '01 · 文本信息代理 I', desc: 'AOI 预设 −log₂(p) 权重 × 印刷墨迹分布，标出文本负荷峰值。' },
      { cls: 'gaze', title: '02 · 注视停留密度 D', desc: '连续注视区间 (间断 ≤ 100 ms) 经 σ = 12 mm 高斯平滑得 s/mm² 密度。' },
      { cls: 'combined', title: '03 · 空间耦合场 C', desc: '同尺度归一化后相乘 C = (I / I_max) · (D / D_max)，凸显注意力交汇峰。' }
    ],

    // Slide 03: Results · Interactive 3-Layer Terrain
    s3Kicker: '03 · 核心结果 · 可交互三层眼动地形',
    s3Title: '文本信息、注视密度与空间耦合的三维同尺度对照',
    s3TerrainTip: '在三维视图内可拖拽旋转、滚轮缩放（不触发翻页）；采用原始坐标，>100 ms 间断不累计。',
    s3SamplesTitle: '样本 (干预条件)',
    s3WindowLabel: '窗口',
    s3Win10s: '前 10 秒',
    s3WinFull: '完整试次',
    s3HeightLabel: '高度倍率',
    s3SpacingLabel: '层间距',
    s3ResetBtn: '重置视角',
    s3SaveBtn: '导出 PNG',
    s3Stamp: '轴测视角 / A4 · 297 × 210 mm',
    s3LegendTitle: '同尺度图例',
    s3Layer00Title: '标识原图',
    s3Layer01Title: '文本信息代理 (I)',
    s3Layer01Desc: 'AOI 权重 × 文字墨迹',
    s3Layer02Title: '注视停留密度 (D)',
    s3Layer02Desc: '有效时长 / 面积 (s/mm²)',
    s3Layer03Title: '信息–注视耦合 (C)',
    s3Layer03Desc: '归一化乘积 (0–1)',
    s4Sprites: { l00: '00 标识原图', l01: '01 文本信息', l02: '02 注视密度', l03: '03 空间耦合' },
    s4Stats: { observed: '有效观测', points: '采样点', dmax: '密度峰值', cmax: '耦合峰值', stimA2: 'A2 · 宝巾花共创版', stimB2: 'B2 · 莲子草共创版' },

    // Slide 04: Discussion & Conclusion
    s4Kicker: '04 · 讨论与结论',
    s4Title: '主要统计结论、解释边界与下一步验证',
    s4ChartHeading: 'N = 13 配对检验结果 (Control vs. Co-created)',
    s4ChartTip: 'SGE_norm (p = 0.1523) 未达显著；固定呈现顺序与预设权重下，结论属探索性证据。',
    s4ChartLegendCtrl: '传统对照 (Control)',
    s4ChartLegendInt: '共创干预 (Intervention)',
    s4ConcHeading: '核心结论',
    s4ConcLead: '共创对话牌未延长总体观看时长，却显著提升了跨区视线切换多样性 (GTE_norm +21.3%, p = 0.0424) 与信息加权摄取代理 (E_gain +127.7%, p = 3.12e-8)。',
    s4LimitsHeading: '研究边界与后续步骤',
    s4Limits: [
      { num: '01', title: '实测先验替换预设 q', desc: '结合访客先验问卷与日语语言模型 Surprisal 校准文本信息权重。' },
      { num: '02', title: '增设理解与回忆后测', desc: '通过阅读后测检验 E_gain 与空间耦合峰 C 是否真实预测知识获得。' },
      { num: '03', title: '平衡 A/B 刺激呈现顺序', desc: '在更大样本中交差平衡呈现顺序，彻底分离版面效应与顺序效应。' }
    ]
  },

  ja: {
    pageTitle: '情報エントロピーと三層視線地形',
    navTabs: [
      { id: 's1', num: '01', short: '課題と目的' },
      { id: 's2', num: '02', short: '分析手法' },
      { id: 's3', num: '03', short: '結果 · 地形' },
      { id: 's4', num: '04', short: '考察と結論' }
    ],

    s1Kicker: '01 · 課題と目的',
    s1Title: 'なぜ「見た時間」だけでは「どこを本当に理解したか」が分からないのか？',
    s1ProbHeading: '従来分析の限界 (N = 13)',
    s1ProbTip: '297×210 mm 植物園サイン (A1/B1 vs A2/B2) の N=13 対応あり実験。総時間は不変なのに本文割合が急減し、時間指標だけでは解釈不能。',
    s1DurLabel: '総注視時間 (Control → Co-created)',
    s1DurVal: '33.11 s → 35.24 s',
    s1DurMeta: 't = 0.386, p = 0.707 (有意差なし)',
    s1DurNote: '同じ約 35 秒の滞在でも、意味のある情報領域を読んだのか漠然と眺めたのかが区別できない。',
    s1ShareLabel: '解説本文への注視割合',
    s1ShareVal: '44.34% → 18.09%',
    s1ShareMeta: '−26.26 pp, p < 0.001',
    s1ShareNote: '割合の低下が「関心の喪失」か「冗長な負荷を避けて要点へ移った結果」かを従来指標は判別できない。',
    s1GoalHeading: 'なぜ情報エントロピーか · 本研究の目的',
    s1GoalTip: 'E_gain や空間結合 C は事前 AOI 重みに基づく認知配分指標であり、次段階で理解度テストと接続して検証します。',
    s1GoalSteps: [
      {
        num: '01',
        tag: '理論的根拠 · 先行研究',
        title: '情報エントロピーとサージで注視の意味を読み解く',
        desc: 'Shannon エントロピーや読解研究 (Hale 2001; Levy 2008; Shiferaw 2019) は、高情報・低予測部位への注視が認知処理負荷を反映することを示し、滞在時間の背後にある意味を解明する手掛かりとなる。'
      },
      {
        num: '02',
        tag: '分析転換 · 時間から構造へ',
        title: '滞在時間をテキスト情報分布と空間構造へ写像する',
        desc: 'マクロ視線エントロピー (SGE / GTE / E_gain) と三層空間地形を組み合わせ、惰性的な滞留と情報駆動の閲読を切り分ける。'
      },
      {
        num: '03',
        tag: '最終目的 · 実質理解領域の特定',
        title: 'サインのどの部分が本当に処理・理解されたかを突き止める',
        desc: '来園者が実際に認知資源を投じた箇所と見落とされた高情報テキストを空間的に特定し、サイン再設計の根拠を得る。'
      }
    ],

    s2Kicker: '02 · 分析手法',
    s2Title: 'マクロ視線エントロピーと三層空間地形の統合モデル',
    s2MacroHeading: '対応ありエントロピー指標 (N = 13)',
    s2MacroTip: 'E_gain の q_AOI は事前設定の領域重み（主解説 0.75 等）であり、実測理解度ではない。',
    s2MacroItems: [
      { sym: 'SGE_norm', desc: '空間格子上の正規化エントロピー — 注視分布の空間的拡散度を測定。' },
      { sym: 'GTE_norm', desc: '正規化遷移エントロピー — AOI 間視線切り替えの予測不能性を測定。' },
      { sym: 'E_gain', desc: 'Σ (p_AOI · −log₂ q_AOI) — 領域情報重み付きの視線配分プロキシ。' },
      { sym: 'η', desc: 'E_gain / 有効時間 — 単位時間あたりの重み付き情報獲得効率。' }
    ],
    s2TerrainHeading: '三層空間地形パイプライン (297 × 210 mm · 112 × 80)',
    s2TerrainTip: '右半サイン領域 (x: 44–96%, y: 3–97%) を抽出；100 ms 超の欠損は非加算；C ≠ η。',
    s2Layers: [
      { cls: 'info', title: '01 · テキスト情報代理 I', desc: 'AOI 設定 −log₂(p) 重み × 印刷インク面積で紙面上の情報ピークを可視化。' },
      { cls: 'gaze', title: '02 · 視線滞留密度 D', desc: '連続注視 (欠損 ≤ 100 ms) を σ = 12 mm ガウス平滑化し s/mm² 密度を算出。' },
      { cls: 'combined', title: '03 · 空間結合場 C', desc: '共通正規化後の積 C = (I / I_max) · (D / D_max) で情報と視線の共起ピークを抽出。' }
    ],

    s3Kicker: '03 · 結果 · インタラクティブ三層視線地形',
    s3Title: 'テキスト情報・滞留密度・空間結合の同尺度 3D 比較',
    s3TerrainTip: '3D 領域内のドラッグ回転・ホイール拡大はページ移動と独立；未補正座標・100 ms 超間断除外。',
    s3SamplesTitle: 'サンプル (介入条件)',
    s3WindowLabel: '観測窓',
    s3Win10s: '最初の 10 秒',
    s3WinFull: '全試行',
    s3HeightLabel: '高さ倍率',
    s3SpacingLabel: '層間隔',
    s3ResetBtn: '視点リセット',
    s3SaveBtn: 'PNG 保存',
    s3Stamp: '軸測図 / A4 · 297 × 210 mm',
    s3LegendTitle: '同尺度凡例',
    s3Layer00Title: 'サイン原図',
    s3Layer01Title: 'テキスト情報代理 (I)',
    s3Layer01Desc: 'AOI 重み × 文字インク',
    s3Layer02Title: '視線滞留密度 (D)',
    s3Layer02Desc: '有効時間 / 面積 (s/mm²)',
    s3Layer03Title: '空間結合 (C)',
    s3Layer03Desc: '正規化積 (0–1)',
    s4Sprites: { l00: '00 サイン原図', l01: '01 テキスト情報', l02: '02 視線密度', l03: '03 空間結合' },
    s4Stats: { observed: '有効観測', points: 'サンプル点', dmax: '密度最大', cmax: '結合最大', stimA2: 'A2 · ブーゲンビリア', stimB2: 'B2 · アルテルナンテラ' },

    s4Kicker: '04 · 考察と結論',
    s4Title: '統計的知見・解釈の境界と今後の検証計画',
    s4ChartHeading: 'N = 13 対応あり検定結果 (統制 vs. 共創)',
    s4ChartTip: 'SGE_norm (p = 0.1523) は非有意。提示順固定・事前重み設定のため探索的知見。',
    s4ChartLegendCtrl: '従来統制 (Control)',
    s4ChartLegendInt: '共創介入 (Intervention)',
    s4ConcHeading: '結論',
    s4ConcLead: '共創サインは総滞在時間を伸ばさず、AOI 間の遷移多様性 (GTE_norm +21.3%, p = 0.0424) と重み付き配分代理 (E_gain +127.7%, p = 3.12e-8) を有意に向上させた。',
    s4LimitsHeading: '研究境界と次のステップ',
    s4Limits: [
      { num: '01', title: '事前確率 q の実測置換', desc: '来園者の事前知識調査や日本語言語モデル Surprisal で AOI 固定重みを較正。' },
      { num: '02', title: '理解・記憶テストの接続', desc: '閲覧後テストにより E_gain と結合ピーク C が学習成果を予測するか検証。' },
      { num: '03', title: '提示順のカウンターバランス', desc: '大標本で A/B 提示順を交差し、順序効果とレイアウト効果を分離する。' }
    ]
  },

  en: {
    pageTitle: 'Information Entropy & 3-Layer Gaze Terrain',
    navTabs: [
      { id: 's1', num: '01', short: 'Problem & Goal' },
      { id: 's2', num: '02', short: 'Method' },
      { id: 's3', num: '03', short: 'Results · 3D' },
      { id: 's4', num: '04', short: 'Discussion' }
    ],

    s1Kicker: '01 · Problem & Objective',
    s1Title: 'Why raw dwell time fails to reveal which parts were truly understood',
    s1ProbHeading: 'The Limitation of Traditional Metrics (N = 13)',
    s1ProbTip: 'From paired N=13 viewing of 297×210 mm garden signage (A1/B1 vs A2/B2). Total stay stayed flat while text share fell sharply, leaving duration metrics ambiguous.',
    s1DurLabel: 'Total Viewing Duration (Control → Co-created)',
    s1DurVal: '33.11 s → 35.24 s',
    s1DurMeta: 't = 0.386, p = 0.707 (n.s.)',
    s1DurNote: 'Identical ~35 s averages mask whether attention engaged dense information or wandered aimlessly.',
    s1ShareLabel: 'Explanation Text Gaze Share',
    s1ShareVal: '44.34% → 18.09%',
    s1ShareMeta: '−26.26 pp, p < 0.001',
    s1ShareNote: 'Lower text % alone cannot tell whether readers gave up reading or skipped overload to absorb key cues.',
    s1GoalHeading: 'Why Information Entropy · Research Objective',
    s1GoalTip: 'E_gain and spatial coupling C act as information-weighted attention proxies to be validated against comprehension post-tests.',
    s1GoalSteps: [
      {
        num: '01',
        tag: 'Theoretical Basis · Prior Work',
        title: 'Using entropy and surprisal to interpret what gaze time means',
        desc: 'Shannon entropy and reading research (Hale 2001; Levy 2008; Shiferaw 2019) link fixation on low-probability / informative regions to cognitive effort — giving explanatory meaning to raw dwell duration.'
      },
      {
        num: '02',
        tag: 'Analytical Shift · Time to Structure',
        title: 'Map dwell trajectories onto spatial information density',
        desc: 'Combine macro gaze entropy (SGE / GTE / E_gain) with a 3-layer spatial terrain to separate passive lingering from information-aligned viewing.'
      },
      {
        num: '03',
        tag: 'Final Goal · Pinpoint Absorbed Content',
        title: 'Identify which zones of the sign were genuinely processed and understood',
        desc: 'Locate where physical dwell intersects high textual value vs. where dense text was missed, guiding evidence-based signage redesign.'
      }
    ],

    s2Kicker: '02 · Method',
    s2Title: 'Combining macro entropy metrics with a 3-layer spatial terrain',
    s2MacroHeading: 'Paired Entropy Suite (N = 13)',
    s2MacroTip: 'q_AOI is a researcher-assigned zone weight (e.g. 0.75 vs 0.12), not a measured reading quiz.',
    s2MacroItems: [
      { sym: 'SGE_norm', desc: 'Normalized spatial entropy — spread of gaze across layout bins.' },
      { sym: 'GTE_norm', desc: 'Normalized Markov transition entropy — uncertainty of cross-AOI switching.' },
      { sym: 'E_gain', desc: 'Σ (p_AOI · −log₂ q_AOI) — information-weighted attention proxy.' },
      { sym: 'η', desc: 'E_gain / valid time — weighted attention proxy rate per second.' }
    ],
    s2TerrainHeading: '3-Layer Field Pipeline (297 × 210 mm · 112 × 80)',
    s2TerrainTip: 'Cropped right sign ROI (x: 44–96%, y: 3–97%); gaps > 100 ms excluded; product C is distinct from η.',
    s2Layers: [
      { cls: 'info', title: '01 · Text Information Proxy I', desc: 'Assigned AOI −log₂(p) weight × printed ink mask locates textual load peaks.' },
      { cls: 'gaze', title: '02 · Gaze Dwell Density D', desc: 'Continuous intervals (gap ≤ 100 ms) smoothed with σ = 12 mm Gaussian kernel (s/mm²).' },
      { cls: 'combined', title: '03 · Spatial Coupling C', desc: 'Normalized product C = (I / I_max) · (D / D_max) highlights text-gaze intersections.' }
    ],

    s3Kicker: '03 · Results · Interactive 3-Layer Gaze Terrain',
    s3Title: 'Aligned 3D comparison of text weight, dwell density, and coupling',
    s3TerrainTip: 'Drag to orbit and wheel-zoom inside the 3D view; uses raw coordinates with >100 ms gaps excluded.',
    s3SamplesTitle: 'Samples (Intervention)',
    s3WindowLabel: 'Window',
    s3Win10s: 'First 10 s',
    s3WinFull: 'Full Trial',
    s3HeightLabel: 'Relief',
    s3SpacingLabel: 'Layer Gap',
    s3ResetBtn: 'Reset',
    s3SaveBtn: 'PNG',
    s3Stamp: 'AXONOMETRIC / A4 · 297 × 210 mm',
    s3LegendTitle: 'Shared Scale',
    s3Layer00Title: 'Stimulus',
    s3Layer01Title: 'Text Proxy (I)',
    s3Layer01Desc: 'AOI weight × ink mask',
    s3Layer02Title: 'Dwell Density (D)',
    s3Layer02Desc: 'Observed time / area (s/mm²)',
    s3Layer03Title: 'Coupling (C)',
    s3Layer03Desc: 'Normalized product (0–1)',
    s4Sprites: { l00: '00 Stimulus', l01: '01 Text Proxy', l02: '02 Dwell', l03: '03 Coupling' },
    s4Stats: { observed: 'Observed', points: 'Samples', dmax: 'Peak D', cmax: 'Peak C', stimA2: 'A2 · Bougainvillea', stimB2: 'B2 · Alternanthera' },

    s4Kicker: '04 · Discussion & Conclusion',
    s4Title: 'Statistical takeaways, validity boundaries, and next steps',
    s4ChartHeading: 'N = 13 Paired Comparison (Control vs. Co-created)',
    s4ChartTip: 'SGE_norm (p = 0.1523) was non-significant; fixed order & assigned priors make results exploratory.',
    s4ChartLegendCtrl: 'Control',
    s4ChartLegendInt: 'Intervention',
    s4ConcHeading: 'Core Conclusion',
    s4ConcLead: 'Co-created signage reorganized scan transitions (GTE_norm +21.3%, p = 0.0424) and raised weighted allocation proxy (E_gain +127.7%, p = 3.12e-8) without increasing total dwell time.',
    s4LimitsHeading: 'Boundaries & Next Validation',
    s4Limits: [
      { num: '01', title: 'Empirical Prior Calibration', desc: 'Replace fixed AOI weights q with visitor knowledge surveys and Japanese LM surprisal.' },
      { num: '02', title: 'Comprehension Post-Testing', desc: 'Pair gaze metrics with recall quizzes to test whether E_gain and C predict learning.' },
      { num: '03', title: 'Counterbalanced Cohort Order', desc: 'Randomize A/B stimulus order in larger samples to isolate layout from order effects.' }
    ]
  }
};
