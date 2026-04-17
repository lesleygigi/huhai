=== chapter5_start ===
~ chapter_name = "第五章：终章·大秦的余烬"
~ scene_name = "第五章·前情"
# bg: black
# hide: huhai
# hide: zhao_gao
# hide: li_si
# hide: ziying

秦二世三年，八月己亥后，至其后数年。

巨鹿的风雪，吹到函谷关，也吹进咸阳宫。

大秦已经走到最后的岔路。

{flags ? 亲征:
你选择亲自东出函谷关。赵高死也好，活也罢，这一次，皇帝必须站在军前。
-> chapter5_mingjun_camp
- else:
{flags ? 反杀赵高:
赵高已死。你亲政未久，巨鹿战报已经压到案前。
-> chapter5_mingjun_camp
- else:
{flags ? 赵高监军:
赵高离开咸阳，赴巨鹿监军。你终于得到一段短暂而危险的喘息。
-> chapter5_puppet_court
- else:
{flags ? 坐视章邯:
你坐视章邯自决，也坐视大秦最后的屏障崩塌。
-> chapter5_fall_wangyi
- else:
{flags ? 离京出巡:
你逃出咸阳，也失去了咸阳。雪夜之中，你必须重新选择去处。
-> chapter5_exile_snow
- else:
你仍困在赵高的阴影里。咸阳宫看似安静，实则刀锋已经抵到门前。
-> chapter5_fall_wangyi
}
}
}
}
}

=== chapter5_mingjun_camp ===
~ scene_name = "函谷关外·大军营帐"
# bg: black
# show: huhai serious center

公元前207年，冬，东出函谷关后，巨鹿战局后段，决战前夜。

函谷关外，秦军大营连绵数十里。

你第一次真正站在军前。

章邯跪在帐中，铠甲上还带着巨鹿的泥雪。

章邯：“陛下，项羽破釜沉舟，锋锐难当。臣请围而不战，断其粮道。”

胡亥：“若朕要速战呢？”

章邯：“速战可振军心，也可能赌上大秦最后的兵。”

你看着案上的舆图。

这不是朝堂上的奏疏。每一道线，都是活人的命。

* [听从章邯，围而不战] -> chapter5_julu_encircle
* [主动出击，一决胜负] -> chapter5_julu_charge

=== chapter5_julu_encircle ===
~ scene_name = "巨鹿决战·围而不战"
# bg: black
# hide: huhai
~ prestige += 3
~ zhang_han += 2
~ flags += 巨鹿解围

你合上舆图。

胡亥：“章邯。按你的法子打。”

章邯：“臣领旨。”

秦军没有急攻项羽。斥候四出，轻骑截粮，重兵压住漳水渡口。

十日后，楚军粮道断绝。

一个月后，项羽被迫西退。巨鹿之围解了。

大秦没有赢得一场辉煌的大捷，却从悬崖边退回半步。

战报传回咸阳，群臣第一次在奏疏中写下四个字：陛下圣明。

-> chapter5_mingjun_ending_choice

=== chapter5_julu_charge ===
~ scene_name = "巨鹿决战·主动出击"
# bg: black
# show: huhai serious center
~ prestige += 5
~ fear = 0
~ zhang_han += 3
~ flags += 巨鹿大捷
~ flags += 巨鹿大捷·亲征

你拔出佩剑，剑锋指向东方。

胡亥：“秦国的皇帝，不躲在帷幕后面等战报。”

三日后，秦军渡河。

章邯从侧翼突入，王离残部死战不退。你在中军亲自擂鼓，鼓声盖过风雪。

项羽被迫退兵。巨鹿城外，楚军旗帜一面面倒下。

这一战之后，天下第一次相信，秦二世并非只能坐在宫中等死。

-> chapter5_mingjun_ending_choice

=== chapter5_mingjun_ending_choice ===
~ scene_name = "明君线·结局分支"
# bg: black
# hide: huhai

巨鹿已定。

章邯仍在军前，子婴守住咸阳，李斯或沉默，或退场，赵高已经不再能决定你的命运。

但天下不是一场战役能结束的。

你必须决定，大秦接下来要成为什么。

* [以军功重塑帝国] -> chapter5_ending_mingjun
* [保宗室，改秦法，与天下重新立约] -> chapter5_ending_rebuild
* {flags ? 隐忍待发} [把隐忍三年的账，刻成帝业] -> chapter5_ending_hidden_dragon
* {flags ? 曾试图告发} [为蒙氏、宗室与旧臣平反] -> chapter5_ending_redemption
* [承认大势已去，保章邯北退] -> chapter5_ending_zhang_surrender

=== chapter5_ending_mingjun ===
~ scene_name = "结局·明君逆袭"
# bg: black
~ flags += 明君逆袭

公元前207年，冬，至公元前202年，冬。

巨鹿大捷后，你没有班师。

你命章邯继续东进，命子婴整肃关中，命刘邦退守霸上，命项羽不得西入函谷。

这些命令并非每一道都被听从。

但至少，天下诸侯必须重新计算秦国的重量。

三年后，关东重归郡县。六国旧贵族或降，或亡，或被迁入关中。

你坐回章台殿。殿下站着章邯、子婴、蒙毅，还有一批曾经不敢抬头看你的臣子。

胡亥：“朕不是父皇。朕也不必成为父皇。”

你用了另一个方式，夺回了本来不属于你的帝国。

结局达成：HE·明君逆袭。

-> chapter5_final_comment

=== chapter5_ending_rebuild ===
~ scene_name = "结局·重塑天下"
# bg: black
~ flags += 重塑天下

公元前207年，冬，至公元前206年及其后。

你没有继续用铁与血逼迫天下低头。

你保留关中为秦，分封宗室与功臣镇守关东，减轻秦法，休养黔首。

李斯说你背叛了始皇帝。

子婴说你救了嬴姓。

很多年后，史官写下：秦二世未能复始皇之烈，却保住了大秦的余烬。

你看着那行字，沉默很久。

余烬也好。

只要不灭，就还有下一场火。

结局达成：HE·重塑天下。

-> chapter5_final_comment

=== chapter5_ending_hidden_dragon ===
~ scene_name = "结局·隐龙出渊"
# bg: black
~ flags += 隐龙出渊

公元前207年，冬，至其后六年。

天下重归一统那日，你独自走进密室。

密室里，旧竹简已经空了。赵高的罪证、你的退路、那些写满恐惧的夜晚，都成了灰。

你在石壁上刻下一行字。

胡亥。始皇帝第十八子。隐忍三年，诛赵高。亲征三年，平天下。

你走出密室，走进章台殿。

群臣俯首。

这一次，他们跪拜的不是赵高立下的傀儡。

他们跪拜皇帝。

结局达成：HE·隐龙出渊。

-> chapter5_final_comment

=== chapter5_ending_redemption ===
~ scene_name = "结局·英雄救赎"
# bg: black
~ flags += 英雄救赎

公元前207年，冬，至其后十年。

巨鹿之后，你召见蒙毅。

胡亥：“蒙上卿。朕若为蒙氏平反，你可愿替朕整饬禁卫？”

蒙毅跪伏在地。

蒙毅：“陛下，臣等了三年。”

你为蒙氏平反，保宗室血脉，修秦法，薄徭役。

你仍然欠很多债。

扶苏、蒙恬、公子高、那些死在你诏书下的人，不会因为你的悔意回来。

但你活着，所以你必须一笔一笔还。

十年后，大秦没有灭亡。

你从来不是完人。你只是终于学会，皇帝的每一次选择都要有人付账。

结局达成：HE·英雄救赎。

-> chapter5_final_comment

=== chapter5_ending_zhang_surrender ===
~ scene_name = "结局·章邯之降"
# bg: black
~ flags += 章邯之降

公元前207年，冬，至公元前206年，冬。

你选择保存章邯。

秦军退出巨鹿，退向北疆。关中空虚，诸侯西进。

章邯在棘原跪别你。

章邯：“陛下，臣不能再替大秦守天下了。但臣还能替秦人守一段长城。”

你没有责怪他。

大势倾倒时，责怪最后一个还肯站着的人，毫无意义。

后来，章邯降楚。再后来，秦亡。

史书写得很短：章邯降，秦势绝。

但你知道，那不是一个人的降。

那是一个帝国终于松开了最后一口气。

结局达成：TE·章邯之降。

-> chapter5_final_comment

=== chapter5_puppet_court ===
~ scene_name = "咸阳宫·章台殿·清洗赵党"
# bg: xianyang_palace
# show: ziying serious center

公元前207年，冬，赵高离京监军后不久。

赵高走了。

他以监军身份前往巨鹿。咸阳的天空难得放晴。

子婴站在章台殿中，递上一卷名单。

上面写着赵高党羽的名字。

子婴：“陛下，时间不多。”

你提起朱笔。

* [雷霆手段，一网打尽] -> chapter5_purge_hard
* [分化瓦解，恩威并施] -> chapter5_purge_soft

=== chapter5_purge_hard ===
~ scene_name = "清洗赵党·雷霆手段"
# bg: xianyang_palace
~ cruelty += 2
~ prestige += 1
~ flags += 雷霆清洗

你勾掉竹简上大半的名字。

胡亥：“这些人，全部拿下。连夜审，不必报朕。”

一夜之间，咸阳马蹄声不断。

赵高经营十余年的网，被你用刀斩断。

血流得太多，但网确实断了。

-> chapter5_puppet_ending_choice

=== chapter5_purge_soft ===
~ scene_name = "清洗赵党·分化瓦解"
# bg: xianyang_palace
~ prestige += 2
~ flags += 分化瓦解

你放下朱笔。

胡亥：“死党下狱，其余人上书自劾，既往不咎。”

第一日，只有寥寥数人。

第三日，自劾奏疏堆成小山。

你不在乎他们是否真心。你只需要他们现在站到你这边。

-> chapter5_puppet_ending_choice

=== chapter5_puppet_ending_choice ===
~ scene_name = "傀儡翻身线·结局分支"
# bg: black
# hide: ziying

清洗完赵党，你开始等待。

等待巨鹿的战报，等待赵高归来，或者等待他再也回不来。

* [在咸阳审判赵高] -> chapter5_ending_puppet
* {flags ? 隐忍待发} [借项羽之刀杀赵高] -> chapter5_ending_borrow_blade

=== chapter5_ending_puppet ===
~ scene_name = "结局·傀儡翻身"
# bg: black
~ flags += 傀儡翻身

公元前207年，冬，至公元前207年，春。

赵高回到咸阳时，一切都变了。

宫门前悬着阎乐的首级。禁卫不再听他的号令。百官不再避你的眼神。

赵高被押入廷尉狱。

赵高：“陛下长大了。”

胡亥：“老师忘了教朕一件事。”

赵高：“什么？”

胡亥：“怎么不做你的傀儡。”

赵高死于东市。

你站在宫墙上，看着黑烟升起。

赵高死了。但项羽还在，刘邦还在，六国还在。

至少从今日起，坐在御座上的人，是你自己。

结局达成：HE·傀儡翻身。

-> chapter5_final_comment

=== chapter5_ending_borrow_blade ===
~ scene_name = "结局·借刀杀人"
# bg: black
~ flags += 借刀杀人

公元前207年，冬，至公元前207年，春。

赵高没有回到咸阳。

他在巨鹿前线陷于楚军阵中，不知所踪。

你拿着军报，看了很久，只批了一个字。

知。

子婴：“陛下，赵高死了。”

胡亥：“朕知道。”

你隐忍三年，不是为了亲手杀他。

是为了让他死。

刀是谁的，不重要。

结局达成：HE·借刀杀人。

-> chapter5_final_comment

=== chapter5_fall_wangyi ===
~ scene_name = "望夷宫·雪夜"
# bg: xianyang_palace
# show: huhai anxious center

公元前207年，冬，望夷宫之变当夜。

赵高没有给你任何机会。

阎乐率兵包围望夷宫。殿外的喊杀声越来越近。

韩谈跪在你面前，老泪纵横。

韩谈：“陛下，老奴护不住陛下。”

殿门被撞开。

阎乐提剑而入。

阎乐：“陛下。丞相有令，请陛下移驾。”

你知道，这是最后一次选择。

* [伏剑自刎] -> chapter5_ending_true_second
* [拼死抵抗] -> chapter5_ending_betrayed
* [与赵高谈判，禅位求生] -> chapter5_ending_ziying_inherit
* {flags ? 宗室屠夫} [宗室血债回到你面前] -> chapter5_ending_clan_butcher

=== chapter5_ending_true_second ===
~ scene_name = "结局·真实的二世"
# bg: black
~ flags += 真实的二世

公元前207年，冬，望夷宫之变当夜。

你接过阎乐递来的剑。

剑刃倒映着冕旒，也倒映着你二十一岁的脸。

你面朝东方跪下。

那是上郡的方向。

胡亥：“兄长，亥弟来了。”

剑光闪过。

你的尸身被赵高以黔首之礼草草埋葬。

秦二世三年而亡。

结局达成：TE·真实的二世。

-> chapter5_final_comment

=== chapter5_ending_betrayed ===
~ scene_name = "结局·众叛亲离"
# bg: black
~ flags += 众叛亲离

公元前207年，冬，望夷宫之变当夜。

你抓起铜灯砸向士卒。

胡亥：“护驾！”

韩谈持短剑挡在你身前。

没有更多人来。

你倒在望夷宫冰冷的地砖上，剑从手中滑落。

殿顶画着龙凤呈祥。

真讽刺。

结局达成：BE·众叛亲离。

-> chapter5_final_comment

=== chapter5_ending_ziying_inherit ===
~ scene_name = "结局·子婴的继承"
# bg: black
~ flags += 子婴的继承

公元前207年，冬，至公元前206年，春。

你被带到赵高府邸。

赵高坐在案后，微笑如旧。

胡亥：“赵高，朕可以禅位。朕只要一条命。”

赵高：“陛下放心。只需下一道诏书，禅位于公子婴。”

几日后，子婴即位，赵高伏诛。

再过几十日，刘邦入关，秦亡。

你被软禁在雍城旧宫，隔着一扇窗听完了帝国最后的声音。

结局达成：TE·子婴的继承。

-> chapter5_final_comment

=== chapter5_ending_clan_butcher ===
~ scene_name = "结局·宗室屠夫"
# bg: black
~ flags += 宗室屠夫终局

公元前207年，冬，至公元前206年。

咸阳城破时，宗室已被你屠戮殆尽。

没有人可用，没有人可守，也没有人愿意救你。

起义军把你押到东市。

那里曾经处死过嬴姓诸公子。

人群中有人喊：活该。

刀落时，你终于明白，宗室不是威胁。

他们本该是你最后的墙。

结局达成：BE·宗室屠夫。

-> chapter5_final_comment

=== chapter5_exile_snow ===
~ scene_name = "咸阳郊外·雪地"
# bg: black
# show: ziying serious center

公元前207年，冬，望夷宫之变后当夜。

你逃出来了。

但你什么都不是了。

子婴在雪夜中找到你，给你披上一件斗篷。

子婴：“陛下必须离开关中。”

你看向茫茫夜色。

* [南下汉中，图谋巴蜀] -> chapter5_ending_bashu
* [东出函谷，投奔章邯] -> chapter5_ending_north_wolf
* [隐姓埋名，了此残生] -> chapter5_ending_east_sea
* {flags ? 隐忍待发} [隐入暗处，伺机再起] -> chapter5_ending_rise_again

=== chapter5_ending_bashu ===
~ scene_name = "结局·巴蜀之主"
# bg: black
~ flags += 巴蜀之主

公元前207年，冬，至汉初。

你南下汉中，在南郑落脚。

后来刘邦被封汉王，来到汉中。

他没有告发你，只派人送来一封信。

刘邦：“公子若不弃，邦愿与公子共分天下。”

你没有做回皇帝。

但你保住了嬴姓的宗庙，保住了大秦最后一点香火。

结局达成：HE·巴蜀之主。

-> chapter5_final_comment

=== chapter5_ending_north_wolf ===
~ scene_name = "结局·北方之狼"
# bg: black
~ flags += 北方之狼

公元前207年，冬，至汉初。

你东出函谷，投奔章邯。

章邯本可以把你绑给项羽。

他没有。

章邯：“臣是大秦的将军。陛下是大秦的皇帝。”

你们退向北疆，收拢残兵，守住长城。

秦朝亡了。

但秦人还在。

结局达成：HE·北方之狼。

-> chapter5_final_comment

=== chapter5_ending_east_sea ===
~ scene_name = "结局·东渡沧海"
# bg: black
~ flags += 东渡沧海

公元前207年，冬，至汉初。

你放弃了名字。

从咸阳到函谷，从大梁到彭城，你一路向东。

最后，你在东海边住下，学会打鱼，学会看潮。

多年后，有人告诉你刘邦做了皇帝。

你只是看着海面。

那里什么都没有。

那里什么都有。

结局达成：HE·东渡沧海。

-> chapter5_final_comment

=== chapter5_ending_rise_again ===
~ scene_name = "结局·东山再起"
# bg: black
~ flags += 东山再起

公元前207年，冬，至公元前206年。

你没有离开关中。

你藏在骊山刑徒中，藏在乡野间，藏在赵高看不到的地方。

三个月后，刘邦攻破武关。赵高杀替身，立子婴。

子婴在宴席上刺杀赵高。

你在子婴投降前夜出现。

胡亥：“叔父，不要降。刘邦和项羽，必有一战。”

你不再争帝位，只争嬴姓血脉能否活下去。

结局达成：HE·东山再起。

-> chapter5_final_comment

=== chapter5_final_comment ===
~ scene_name = "终章·史家评语"
# bg: black
# hide: huhai
# hide: zhao_gao
# hide: li_si
# hide: ziying

画面暗下。

太史公曰：秦之亡，非一人之过，非一事之由。

沙丘之谋，二世之惧，赵高之奸，秦法之苛，天下之势，数者合流，遂成大崩。

后人观史，当知兴替。

慎之，戒之。

《胡亥模拟器》·全剧本终。

-> END
