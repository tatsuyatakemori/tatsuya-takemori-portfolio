// 書誌はdata.js、説明はresearch-details.mjs。動画は本文のsectionに対応付けて常時表示する。
export const researchReferences = {
  snake: {
    sectionRefs: {"approach":["gait","ladder"],"adaptation":["hoop","adaptive","pipes"],"hardware":["ladder","spirit","ladder-blog"],"trajectory":["thesis","student-award","press-blog"]},
    videos: [
      {"id":"w89D4oRrrSQ","title":"研究全体の紹介：複雑な環境を移動する","by":"松野研究室","note":"さまざまな動作と研究の狙いをまとめた紹介映像。まず全体像を知りたい方へ。","refs":["gait","ladder","hoop"],"section":"overview"},
      {"id":"t2UYf6OzyyI","title":"未知の断面形状に、巻き付き方を合わせる","by":"松野研究室","note":"異形断面の配管に適応する螺旋捻転動作。対応する論文と合わせて、形状の変化に注目してください。","refs":["adaptive"],"section":"adaptation"},
      {"id":"qMxPdsquKdM","title":"配管の継ぎ目にあるフランジを乗り越える","by":"松野研究室","note":"配管に巻き付いた体が、途中の突起を越えていく動作。曲線を組み合わせて設計した体の形と、移動の関係を見る映像です。","refs":["gait"],"section":"approach","discoveredAt":"https://www.youtube.com/@matsunolab/videos"},
      {"id":"uGToOjh9LkY","title":"凹凸の大きい不整地を移動する","by":"松野研究室","note":"体全体を使って不整地を進む実演。平らな床とは違う環境で、どの部分が地面に触れているかに注目してください。","refs":["gait"],"section":"approach","discoveredAt":"https://www.youtube.com/@matsunolab/videos"},
      {"id":"kN9AIQQZRw4","title":"はしごを登る：フィールド評価会での実演","by":"松野研究室","note":"2017年のImPACT TRC第5回フィールド公開評価会で発表した動作。本人のブログでも紹介されている、はしご昇降の映像です。","refs":["ladder","ladder-blog"],"section":"hardware","discoveredAt":"https://www.youtube.com/@matsunolab/videos"},
      {"id":"KOVBQ3RJtHQ","title":"公開実演を伝える取材映像","by":"共同通信","note":"本人のブログで紹介された、2017年のヘビ型ロボットの取材映像。京都大学などの共同研究チームによる、配管内の移動を伝えています。","refs":["press-blog"],"section":"trajectory","discoveredAt":"https://tattatatakemori.hatenablog.com/entry/2017/08/30/205042"},
    ],
    papers: [
      {"id":"gait","url":"https://doi.org/10.1109/TRO.2018.2830346","label":"曲線の組み合わせから、動きを設計する","note":"基本となる動作設計法。配管のフランジ乗り越えと、不整地を進むクローラ状の動きを実機で検証しています。","access":"出版社・書誌情報","links":[{"label":"著者公開版 PDF（電気通信大学）","url":"https://uec.repo.nii.ac.jp/record/9078/files/TRO_2018_edited_finalVer.pdf"}]},
      {"id":"ladder","url":"https://doi.org/10.1109/IROS.2018.8594411","label":"はしご登りと、引っかかりにくい外装","note":"動作設計に加え、櫛状の部材で滑らかな外表面をつくる実機構造を扱う国際会議論文です。","access":"出版社・書誌情報"},
      {"id":"hoop","url":"https://ieeexplore.ieee.org/document/9387411","label":"異なる環境をつなぐ「輪くぐり動作」","note":"壁の穴を抜ける、床下へ入る、はしごへ取り付く。別々の環境の間で、体全体の動きを切り替える手法です。","access":"出版社・書誌情報","links":[{"label":"著者公開版 PDF（電気通信大学）","url":"https://uec.repo.nii.ac.jp/record/10092/files/HoopPassing_ver7.3_20210203_submit.pdf"}]},
      {"id":"pipes","url":"https://doi.org/10.3389/frobt.2021.629368","readUrl":"https://www.frontiersin.org/journals/robotics-and-ai/articles/10.3389/frobt.2021.629368/full","label":"曲がり・分岐など、複雑な配管への展開","note":"共著研究。配管の形に合わせて体の一部を設計し、複数の障害や管の内外の移動を共通の考え方で扱います。公開本文には図と補足動画もあります。","access":"公開本文・補足動画を読む"},
      {"id":"adaptive","url":"https://ieeexplore.ieee.org/document/9834040","label":"断面形状が未知の配管に適応する","note":"巻き付き形状を局所的に変形させ、未知の断面に合わせながら移動する研究。大学時代からの取り組みが、2023年の雑誌掲載へつながっています。","access":"出版社・書誌情報"},
      {"id":"thesis","url":"https://repository.kulib.kyoto-u.ac.jp/handle/2433/266033","label":"博士研究の位置づけを知る","note":"京都大学の学位論文記録。公開されている要旨・審査結果から、学位研究の全体像を確認できます。","access":"学位情報・要旨を読む"},
    ],
    sources: [
      {"id":"spirit","url":"https://www.kyoto-u.ac.jp/kurenai/202103/spirit/robot.html","label":"発想と実機開発の背景","title":"災害に立ち向かうロボットの原動力は〈エンタメ精神〉","by":"京都大学広報誌『紅萠』","year":"2021","kind":"大学の取材記事","note":"ロボットづくりの動機や、滑らかな関節構造の着想を紹介。ヘビ型ロボットとFUHGAに共通する姿勢が分かります。"},
      {"id":"student-award","url":"https://www.ieee-jp.org/section/tokyo/chapter/RA-24/RASJPStudentAuthorAward_2021.html","label":"輪くぐり動作の論文と受賞","title":"IEEE RAS Japan Joint Chapter Student Author Award 2021","by":"IEEE RAS Japan Joint Chapter","year":"2021","kind":"受賞記録","note":"受賞者名と対象論文を掲載。環境間の移動に関する論文が、どの受賞につながったかを確認できます。","links":[{"label":"本人の業績一覧も見る","url":"https://tattatatakemori.hatenablog.com/entry/2017/12/13/220020"}]},
      {"id":"gizmodo","url":"https://www.gizmodo.jp/2018/10/ladder-climbing-robot-snake-freaks.html","label":"はしご登りがメディアで紹介された記録","title":"はしごを登るヘビ型ロボットの紹介","by":"GIZMODO Japan","year":"2018","kind":"メディア記事","note":"動作の印象を一般向けに伝えた記事。手法や機構の詳しい説明は、上記のIROS論文へ。"},
      {"id":"ladder-blog","url":"https://tattatatakemori.hatenablog.com/entry/2017/11/13/222255","label":"はしご登りの公開デモと、当時の報告","title":"ImPACT TRC 第五回フィールド評価会 ヘビ型ロボットによるはしご登り","by":"竹森達也・個人ブログ","year":"2017","kind":"本人の実演記録","note":"公開デモでのはしご登りについて、研究室の映像とともに報告しています。"},
      {"id":"press-blog","url":"https://tattatatakemori.hatenablog.com/entry/2017/08/30/205042","label":"共同研究の公開発表とメディアでの紹介","title":"ImPACTヘビのプレスリリース","by":"竹森達也・個人ブログ","year":"2017","kind":"本人の活動記録","note":"ヘビ型ロボットのプレスリリースを報告し、共同通信の動画などを紹介した記事です。"},
    ],
  },
  fuhga: {
    sectionRefs: {"team":["tdp","report2019","spirit"],"design":["development","tdp"],"results":["wrs","university","works"],"field":[]},
    paragraphRefs: {"field":[["spirit"],[]]},
    pointRefs: {"results":[["wrs","development"],["university","report2019"],["works"]]},
    videos: [
      {"id":"IIPH8K0KFhE","title":"FUHGA2：RoboCup 2019優勝機の紹介","by":"松野研究室","note":"走行とアーム作業を備えた機体の紹介映像。多機能を一台にまとめた構成を、技術資料と合わせて見られます。","refs":["development","tdp"],"section":"overview"},
      {"id":"sl_n8XsNDao","title":"FUHGA：RoboCup Japan Open 2017","by":"松野研究室","note":"初代FUHGAとSHINOBIの大会紹介映像。FUHGA2へつながる、走行とアーム作業を備えた機体を見られます。","refs":[],"section":"team","discoveredAt":"https://www.youtube.com/@matsunolab/videos"},
      {"id":"mBCwzYIsm-w","title":"FUHGA2：実プラントでの走行・計測・作業","by":"松野研究室","note":"千代田化工建設の子安デモンストレーションプラントでの実証映像。階段や不整地の走行、データ計測、バルブやレバーの操作を試しています。","refs":[],"section":"field","discoveredAt":"https://www.youtube.com/@matsunolab/videos"},
      {"id":"xpR1KR7L6jI","title":"FUHGA3：後継機の紹介（2022年公開）","by":"松野研究室","note":"大学時代に開発を進めたFUHGA3の、その後の紹介映像。研究室チームのRoboCup 2022出場機を扱っています。","refs":["works"],"section":"results","discoveredAt":"https://www.youtube.com/@matsunolab/videos"},
    ],
    papers: [
      {"id":"development","url":"https://doi.org/10.1080/01691864.2019.1697751","label":"FUHGA2の設計とWRS 2018での評価","note":"多機能レスキューロボットの開発をまとめた論文。機体設計と大会を通じた評価を、技術的に知りたい方へ。","access":"出版社・書誌情報"},
    ],
    sources: [
      {"id":"tdp","url":"https://tdp.robocup.org/tdp/2019-tdp-shinobi-robocuprescue-robot/","label":"機構・制御・センサーと、チーム内の担当","title":"RoboCup Rescue 2019 Team Description Paper — SHINOBI","by":"SHINOBI / RoboCup公式資料アーカイブ","year":"2019","kind":"チーム技術資料","note":"大会前に提出した構成資料。機体・操作系の説明、CAD図、部品表、担当一覧を掲載。竹森は回路・制御・アーム設計・操縦・チームリーダーなどを担当しています。","links":[{"label":"技術資料 PDF（4ページ）","url":"https://tdp.robocup.org/wp-content/uploads/tdp/robocup/2019/robocuprescue-robot/shinobi-163/robocup-2019-robocuprescue-robot-shinobihLyCQ2n8m0.pdf"}]},
      {"id":"wrs","url":"https://prtimes.jp/main/html/rd/p/000000003.000036632.html","label":"WRS 2018の成果と共同開発体制","title":"World Robot Summit 2018でチームSHINOBIが優勝","by":"JOHNAN株式会社","year":"2018","kind":"共同開発企業の発表","note":"STM部門の優勝と経済産業大臣賞を報告。京都大学・東北大学・JOHNANによる共同開発と支援の内容も紹介されています。"},
      {"id":"university","url":"https://www.t.kyoto-u.ac.jp/publicity/no74/news/2aives","label":"RoboCup 2019、総合優勝の公式報告","title":"機械理工学専攻松野研のチームSHINOBIが ロボカップ世界大会で優勝","by":"京都大学工学広報 No.74 / 竹森達也","year":"2020","kind":"大学の大会報告","note":"移動・作業・自律探索を競う大会での成果。日本チームとして14年ぶりの総合優勝と、Dexterity部門の優勝を報告しています。"},
      {"id":"report2019","url":"https://tattatatakemori.hatenablog.com/entry/2019/07/10/232103","label":"改良した点と、開発・操縦の振り返り","title":"RoboCup世界大会2019 優勝！","by":"竹森達也・個人ブログ","year":"2019","kind":"本人の開発記録","note":"アーム、電子回路、制御ソフトなどの担当や、前年度からの機体改良、大会中の運用を記録しています。"},
      {"id":"spirit","url":"https://www.kyoto-u.ac.jp/kurenai/202103/spirit/robot.html","label":"毎年の開発と、現場から得た課題","title":"災害に立ち向かうロボットの原動力は〈エンタメ精神〉","by":"京都大学広報誌『紅萠』","year":"2021","kind":"大学の取材記事","note":"毎年新しい機体をつくるチームの姿勢と、2018年の岡山県での災害対応を通じて見えた課題を紹介しています。"},
      {"id":"works","url":"https://tattatatakemori.hatenablog.com/entry/2018/05/18/164650#FUHGA3","label":"後継機FUHGA3の構成と大会記録","title":"製作物まとめ — FUHGA3","by":"竹森達也・個人ブログ","year":"2021年の記録を含む","kind":"本人の作品紹介","note":"前後の3次元LiDARを備えた後継機と、RoboCup 2021での部門優勝を紹介。遠隔開催の同大会では総合優勝は決定されていません。"},
    ],
  },
  mimebot: {
    sectionRefs: {"experience":["jp-paper","project"],"mechanism":["momm","jp-paper"],"performance":["project","performance-blog"],"publications":["journal","momm","slides","award"]},
    videos: [
      {"id":"N6OWAsTIqzk","title":"Mime × Mimebots：30秒の公演ダイジェスト","by":"土田修平","note":"パントマイムとロボットを組み合わせた作品。人と球体の関係や、見かけの転がりに注目してください。","refs":["project"],"section":"overview"},
      {"id":"_YF2t0Bg5x4","title":"原理を知る：インタラクション2016のデモ","by":"土田修平","note":"共著者の研究ページで日本語版として紹介されているデモ映像。球体表示と移動の組み合わせを確認できます。","refs":["jp-paper"],"section":"experience"},
      {"id":"U4-VryNb5SE","title":"公演を複数の視点から見る","by":"土田修平","note":"ダイジェストからさらに詳しく見たい方へ。公演を別のアングルから記録した映像です。","refs":["project"],"section":"performance"},
      {"id":"Rxt1xA4fm1U","title":"Mimebot Concept：移動と見え方の設計","by":"土田修平","note":"共著者の研究ページで公開されているコンセプト映像。ロボットの移動と球体の見かけの動き、その組み合わせを紹介します。","refs":["project","momm"],"section":"mechanism","discoveredAt":"https://shuhei2306.com/research/mimebot.html"},
      {"id":"TK5z85GRI7g","title":"球体ディスプレイの表現を見る","by":"土田修平","note":"LED Display Ball Effects。球体上の表示がつくる見え方を、パフォーマンス映像と合わせて確認できます。","refs":["project"],"section":"experience","discoveredAt":"https://shuhei2306.com/research/mimebot.html"},
      {"id":"DRCiBxQNQ3g","title":"Mime × Mimebots：旧ブログで紹介したフル版","by":"土田修平","note":"2016年の本人のブログで、30秒ダイジェストに続くフル版として紹介された映像。人とロボットのやり取りを通して見られます。","refs":["performance-blog","project"],"section":"performance","discoveredAt":"https://tattatatakekeke.blog.fc2.com/blog-entry-147.html"},
    ],
    papers: [
      {"id":"jp-paper","url":"https://da.lib.kobe-u.ac.jp/da/kernel/90005143/","label":"日本語で読む：仕組みと錯視の検証","note":"球体表示と全方向移動を組み合わせる提案、試作機を使った実験を解説。神戸大学のリポジトリで論文全文が公開されています。","access":"日本語の公開本文へ"},
      {"id":"momm","url":"https://doi.org/10.1145/3007120.3007128","label":"国際会議での発表：設計とパフォーマンス","note":"MoMM 2016で発表した研究。機構・位置推定・光による見え方と、公演での検討をまとめています。","access":"出版社・書誌情報","links":[{"label":"著者公開版 PDF（土田修平）","url":"https://shuhei2306.com/pdf/mimebot_preprint.pdf"}]},
      {"id":"journal","url":"https://doi.org/10.1108/IJPCC-01-2017-0006","label":"受賞につながった国際ジャーナル論文","note":"IJPCCに掲載されたMimebotの論文。2018年にHighly Commended Awardを受賞しました。","access":"出版社・書誌情報"},
    ],
    sources: [
      {"id":"project","url":"https://shuhei2306.com/research/mimebot.html","label":"研究・公演の全体像と制作クレジット","title":"Mimebot: Sphere-shaped Mobile Robot Imitating Rotational Movement","by":"土田修平・研究紹介ページ","year":"2016年の発表資料を含む","kind":"共著者のプロジェクトページ","note":"複数の映像、論文、発表スライド、出演・制作クレジットを集約。竹森の移動ロボット開発と、ほかのメンバーの担当も確認できます。"},
      {"id":"slides","url":"https://www.slideshare.net/ShuheiTsuchida/mimebot-sphereshaped-mobile-robot-imitating-rotational-movement-momm2016-presentation-tsuchida","label":"図で辿る、MoMM 2016の発表","title":"Mimebot — MoMM 2016 presentation","by":"土田修平","year":"2016","kind":"発表スライド","note":"研究ページから公開されている英語の発表資料。論文と合わせて、説明の流れを図で追いたい方へ。"},
      {"id":"award","url":"https://tattatatakemori.hatenablog.com/entry/2018/07/24/183600","label":"Highly Commended Awardの受賞報告","title":"IJPCC 2018 Highly Commended Award","by":"竹森達也・個人ブログ","year":"2018","kind":"本人の受賞報告","note":"対象論文と賞状の写真を掲載。第二著者としてロボット開発を担当したことも記されています。"},
      {"id":"performance-blog","url":"https://tattatatakekeke.blog.fc2.com/blog-entry-147.html","label":"制作当時の紹介と、ダイジェスト・フル版","title":"その147 Mime × Mimebots","by":"竹森達也・旧ブログ","year":"2016","kind":"本人の制作記録","note":"2015年度の制作を振り返り、作品のダイジェストとフル版を紹介した記事です。"},
    ],
  },
  robotrace: {
    sectionRefs: {"jiten":["jiten","jiten2"],"omnimo":["omnimo","omnimo2","reflection"],"catchrobo":["toreta","catch-report"],"originality":["result2013","result2014","jiten2","catch-report"]},
    videos: [
      {"id":"lqWeGlEpHJc","title":"JITEN：回転しながらラインをたどる","by":"京大機械研究会","note":"最初に制作したライントレーサー。2つのセンサーでラインを捉える機体の動きを見られます。","refs":["jiten"],"section":"overview"},
      {"id":"-yDPWbt3V5k","title":"OmnimO：2013年全日本大会の決勝","by":"竹森達也","note":"全方向移動でコースを走る初代OmnimO。コース記憶を備える前の機体です。","refs":["omnimo","result2013"],"section":"omnimo"},
      {"id":"lMzBxPXLrYo","title":"OmnimO-2：2014年決勝コースの試走","by":"竹森達也","note":"コースを記憶して加減速する後継機の試走。大会本番の競技映像とは区別して掲載しています。","refs":["omnimo2"],"section":"omnimo"},
      {"id":"ubBuBMH1oqg","title":"取れ太：キャチロボに向けた練習","by":"京大機械研究会","note":"ローラーで箱入り菓子を取得・運搬・箱入れする機構。大会前の練習映像で、動作ミスも含む記録です。","refs":["toreta","catch-report"],"section":"catchrobo"},
      {"id":"8cSfvsHjKfQ","title":"JITEN2：回転式ライントレーサーの改良版","by":"竹森達也","note":"最初のJITENから、曲がり角や十字路への対応を改良した機体。回転する動きとラインの追従を見比べられます。","refs":["jiten2"],"section":"jiten","discoveredAt":"https://seesaawiki.jp/rbbtake/d/JITEN2"},
      {"id":"fsWhUUkQBgQ","title":"OmnimO-2：ショートカットの実験","by":"竹森達也","note":"コースマップを使ったショートカットのテスト。本人の作品Wikiで紹介されている実験映像です。","refs":["omnimo2"],"section":"omnimo","discoveredAt":"https://seesaawiki.jp/rbbtake/d/OmnimO-2"},
      {"id":"DSWm50Sb7c0","title":"OmnimO-2：加速する向きを調整する試走","by":"竹森達也","note":"2014年全日本大会の予選コース試走。探索で得たマップに合わせ、安定して加速できる向きに姿勢を調整する走行です。","refs":["omnimo2","reflection"],"section":"omnimo","discoveredAt":"https://seesaawiki.jp/rbbtake/d/OmnimO-2"},
    ],
    papers: [
    ],
    sources: [
      {"id":"jiten","url":"https://seesaawiki.jp/rbbtake/d/JITEN","label":"JITEN：2つのセンサーで走る仕組み","title":"JITEN","by":"竹森達也・作品Wiki","year":"2012年の機体","kind":"本人の機体資料","note":"部品構成、走行映像、十字路を抜けるための考え方を記録。初めて制作したロボットの発想を辿れます。"},
      {"id":"jiten2","url":"https://seesaawiki.jp/rbbtake/d/JITEN2","label":"JITEN2：小さな曲がり角への対応","title":"JITEN2","by":"竹森達也・作品Wiki","year":"2012年の機体","kind":"本人の機体資料","note":"モーターの正逆転や、ラインを見失ったときの引き返し動作などの改良を解説。中部地区大会の特別賞も記録しています。"},
      {"id":"omnimo","url":"https://seesaawiki.jp/rbbtake/d/OmnimO","label":"初代OmnimO：40個のラインセンサー","title":"OmnimO","by":"竹森達也・作品Wiki","year":"2013年の機体","kind":"本人の機体資料","note":"4輪のオムニホイールで全方向に移動。機体写真、部品表、大会動画、受賞歴と、当時の狙いをまとめています。"},
      {"id":"omnimo2","url":"https://seesaawiki.jp/rbbtake/d/OmnimO-2","label":"OmnimO-2：コースを記憶して走る","title":"OmnimO-2","by":"竹森達也・作品Wiki","year":"2014年の機体","kind":"本人の機体資料","note":"48個のラインセンサー、エンコーダ、ジャイロを使う後継機。実測したコースマップや加減速・ショートカットの実験映像があります。"},
      {"id":"reflection","url":"https://tattatatakekeke.blog.fc2.com/blog-entry-122.html","label":"全方向移動を採用して、何が分かったか","title":"その122 オムニホイールを使ったロボトレースについて","by":"竹森達也・旧ブログ","year":"2014","kind":"設計の振り返り","note":"計測の利点だけでなく、グリップや接地の課題、センサー・回路構成の反省まで。試作を通して得た知見を読む資料です。"},
      {"id":"toreta","url":"https://seesaawiki.jp/rbbtake/d/%bc%e8%a4%ec%c2%c0%28%a5%ad%a5%e3%a5%c1%a5%ed%a5%dc%a5%d0%a5%c8%a5%eb%a5%b3%a5%f3%a5%c6%a5%b9%a5%c8%29","label":"取れ太：機構と竹森の担当","title":"取れ太（キャチロボバトルコンテスト）","by":"竹森達也・作品Wiki","year":"2013","kind":"本人の機体資料","note":"機械研究会チームで制作した機体。モータードライバ回路、ソフトウェアの一部、操縦を担当したことと、練習映像を掲載しています。"},
      {"id":"catch-report","url":"https://kikaiken.blogspot.com/2013/09/2-598-17-4-9-3-7-3-2-nhk-3223-4-14-7-8.html","label":"ローラー1本に機能をまとめた発想の経緯","title":"キャチロボバトルコンテスト2013","by":"京都大学機械研究会 / 竹森達也","year":"2013","kind":"チームの大会報告","note":"5人のチームでの開発と、取得・運搬・箱入れを一つの機構で行うアイデアを紹介。17チーム中ベスト4、審査員特別賞の記録です。"},
      {"id":"result2013","url":"https://www.ntf.or.jp/mouse/micromouse2013/mm2013result01.html","label":"OmnimO、全日本大会の特別賞","title":"第34回全日本マイクロマウス大会 競技結果","by":"ニューテクノロジー振興財団","year":"2013","kind":"主催者の大会結果","note":"ロボトレース決勝のOmnimO／竹森達也の行に、特別賞と競技記録を掲載しています。"},
      {"id":"result2014","url":"https://www.ntf.or.jp/mouse/micromouse2014/MM2014recode01.html","label":"OmnimO-2、特別枠での決勝進出","title":"第35回全日本マイクロマウス大会 競技結果","by":"ニューテクノロジー振興財団","year":"2014","kind":"主催者の大会結果","note":"予選の特別枠での決勝進出と、決勝27位の記録。2013年の初代OmnimOの特別賞とは別の実績です。"},
      {"id":"archive","url":"https://tattatatakemori.hatenablog.com/","label":"その後の製作記録も読む","title":"メカトロニクスにうってつけの日","by":"竹森達也","year":"随時更新","kind":"個人ブログ","note":"研究・制作・技術メモのアーカイブ。大学時代から現在につながる取り組みを掲載しています。"},
    ],
  },
};
