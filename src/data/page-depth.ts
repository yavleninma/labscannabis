import type { Locale } from "@/lib/i18n";
import type { SeoContent } from "@/lib/seo-content";

/**
 * Добавочная глубина коммерческих страниц (волна 2).
 *
 * Медиана собственного текста на indexable-странице была 57-368 слов, а по
 * конкурентным запросам топ держат 800-2000 слов. Дописывать это прямо в
 * `PAGE_COPY` нельзя без риска: там лежит «лицо» страницы — `h1`, `intro` и
 * `closing`, вычитанные на соответствие §1.6, и они уходят в meta. Поэтому
 * добавочные разделы живут отдельным файлом и приклеиваются тем же
 * `mergeSeoContent`, что и `content-cache`: дедупликация по заголовку и по
 * вопросу уже есть, повтор темы просто не отрисуется.
 *
 * Каждый раздел отвечает на вопрос, который человек задаёт вслух, и ни один не
 * повторяет соседнюю страницу: похожесть Жаккара внутри локали замеряется
 * `npm run check:seo` и обязана остаться ниже 0.35.
 *
 * ЗАПРЕЩЕНО здесь: цены и любые суммы, часы работы, «без рецепта», обещания
 * эффекта, оценочные обороты про товар. Линтер `scripts/check-seo.mjs` роняет
 * сборку, и это правильно.
 */
export type DepthContent = Pick<SeoContent, "sections" | "faq">;

export const PAGE_DEPTH: Record<string, Partial<Record<Locale, DepthContent>>> = {
  "labs-dispensary-pattaya": {
    en: {
      sections: [
        {
          h2: "Which shop this is, and which it is not",
          body:
            "Pattaya has more than one business trading under a name built from the same two or three words, and search engines mix them up regularly. The check takes ten seconds and settles it: the sign says LABS DISPENSARY, the address is 32 Pattaya 13 Alley in South Pattaya, and the phone number on the door is the number printed on this site. If any one of those three does not match what you are looking at, you are standing in front of a different business — not a branch of this one, because there are no branches.",
        },
        {
          h2: "What we do not sell",
          body:
            "No vapes, no e-cigarettes and no tobacco products, in any form. That is not a stylistic preference: the sale of vapes and e-cigarettes is prohibited in Thailand, and a shop that quietly keeps them under the counter is a shop willing to gamble with the licence that lets it open at all. This is a flower counter, run under the rules for a controlled herb, and everything that leaves it does so in person, to an adult of 20 or over holding a prescription issued in Thailand.",
        },
      ],
      faq: [
        {
          q: "How do I make sure I am dealing with this shop and not one with a similar name?",
          a: "Match three things: the LABS DISPENSARY sign, the address 32 Pattaya 13 Alley, and the phone number published on this site. There are no branches, so a second address under the same name is somebody else.",
        },
        {
          q: "Do you take orders through social media?",
          a: "No. Nothing is ordered or paid for through any channel — messaging is for questions and directions only. Purchases happen at the counter.",
        },
      ],
    },
    ru: {
      sections: [
        {
          h2: "Какой это магазин и какой не этот",
          body:
            "В Паттайе не одно заведение с названием из тех же двух-трёх слов, и поисковики их регулярно путают. Проверка занимает десять секунд и снимает вопрос: на вывеске написано LABS DISPENSARY, адрес — 32 Pattaya 13 Alley в Южной Паттайе, а телефон на двери совпадает с номером на этом сайте. Если хотя бы одно из трёх не сходится, перед вами другой бизнес, а не наш филиал: филиалов нет.",
        },
        {
          h2: "Чего у нас нет",
          body:
            "Ни вейпов, ни электронных сигарет, ни табачной продукции — ни в каком виде. Это не вопрос вкуса: продажа вейпов и электронных сигарет в Таиланде запрещена, и магазин, который тихо держит их под прилавком, — это магазин, готовый рискнуть лицензией, на которой держится всё остальное. Здесь прилавок с соцветиями, работающий по правилам для контролируемой травы, и всё, что с него уходит, уходит лично в руки взрослому от 20 лет с рецептом, выданным в Таиланде.",
        },
      ],
      faq: [
        {
          q: "Как убедиться, что это тот самый магазин, а не похожий по названию?",
          a: "Сверьте три вещи: вывеску LABS DISPENSARY, адрес 32 Pattaya 13 Alley и телефон, опубликованный на этом сайте. Филиалов нет, поэтому второй адрес под тем же именем — это кто-то другой.",
        },
        {
          q: "Принимаете ли вы заявки через соцсети?",
          a: "Нет. Ни в одном канале ничего не заказывается и не оплачивается: переписка нужна для вопросов и дороги. Покупка происходит у прилавка.",
        },
      ],
    },
    th: {
      sections: [
        {
          h2: "ร้านนี้คือร้านไหน และไม่ใช่ร้านไหน",
          body:
            "ในพัทยามีธุรกิจมากกว่าหนึ่งแห่งที่ใช้ชื่อประกอบจากคำสองสามคำเดียวกัน และเครื่องมือค้นหาก็สลับกันอยู่บ่อย ๆ ตรวจสามอย่างใช้เวลาสิบวินาที ป้ายหน้าร้านเขียนว่า LABS DISPENSARY ที่อยู่คือ 32 Pattaya 13 Alley พัทยาใต้ และเบอร์โทรที่หน้าร้านตรงกับเบอร์บนเว็บนี้ ถ้าข้อใดข้อหนึ่งไม่ตรง แปลว่าเป็นคนละธุรกิจ ไม่ใช่สาขา เพราะเราไม่มีสาขา",
        },
        {
          h2: "สิ่งที่ร้านนี้ไม่มีขาย",
          body:
            "ไม่มีบุหรี่ไฟฟ้าและผลิตภัณฑ์ยาสูบทุกชนิด การขายบุหรี่ไฟฟ้าเป็นสิ่งต้องห้ามในประเทศไทย และร้านที่แอบเก็บไว้ใต้เคาน์เตอร์คือร้านที่ยอมเสี่ยงกับใบอนุญาตของตัวเอง ที่นี่เป็นเคาน์เตอร์ช่อดอกที่ดำเนินการตามกฎของสมุนไพรควบคุม และทุกอย่างส่งมอบต่อหน้า ให้ผู้ที่อายุ 20 ปีขึ้นไปซึ่งมีใบสั่งยาที่ออกในประเทศไทย",
        },
      ],
      faq: [
        {
          q: "จะรู้ได้อย่างไรว่าเป็นร้านนี้ ไม่ใช่ร้านชื่อคล้ายกัน?",
          a: "ตรวจสามอย่าง ป้าย LABS DISPENSARY ที่อยู่ 32 Pattaya 13 Alley และเบอร์โทรที่เผยแพร่บนเว็บนี้ เราไม่มีสาขา ที่อยู่อื่นภายใต้ชื่อเดียวกันจึงเป็นคนละร้าน",
        },
        {
          q: "สั่งผ่านโซเชียลได้ไหม?",
          a: "ไม่ได้ ไม่มีการรับคำสั่งซื้อหรือการชำระเงินในช่องทางใด ข้อความใช้ถามข้อมูลและเส้นทางเท่านั้น การซื้อขายเกิดขึ้นที่เคาน์เตอร์",
        },
      ],
    },
    ar: {
      sections: [
        {
          h2: "أي متجر هذا، وأيها ليس هو",
          body:
            "في باتايا أكثر من نشاط تجاري يستخدم اسما مركبا من الكلمتين أو الثلاث نفسها، ومحركات البحث تخلط بينها بانتظام. الفحص يستغرق عشر ثوان ويحسم الأمر: اللافتة تقول LABS DISPENSARY، والعنوان 32 Pattaya 13 Alley في جنوب باتايا، ورقم الهاتف على الباب هو الرقم المنشور في هذا الموقع. وإذا لم يتطابق واحد من هذه الثلاثة فأنت أمام نشاط آخر، لا فرع لنا، لأنه لا توجد فروع.",
        },
        {
          h2: "ما لا يُباع هنا",
          body:
            "لا سجائر إلكترونية ولا منتجات تبغ بأي شكل. هذا ليس تفضيلا شخصيا: بيع السجائر الإلكترونية محظور في تايلاند، والمتجر الذي يخفيها تحت الطاولة متجر يقامر بالرخصة التي تسمح له بالعمل أصلا. هنا طاولة زهور تعمل وفق قواعد العشبة الخاضعة للرقابة، وكل ما يخرج منها يُسلَّم وجها لوجه لبالغ عمره 20 عاما فأكثر يحمل وصفة صادرة في تايلاند.",
        },
      ],
      faq: [
        {
          q: "كيف أتأكد أنني في هذا المتجر لا في متجر باسم مشابه؟",
          a: "طابق ثلاثة أشياء: لافتة LABS DISPENSARY، والعنوان 32 Pattaya 13 Alley، ورقم الهاتف المنشور في هذا الموقع. لا توجد فروع، فأي عنوان ثان بالاسم نفسه هو شخص آخر.",
        },
        {
          q: "هل تقبلون الطلبات عبر وسائل التواصل؟",
          a: "لا. لا يُسجَّل طلب ولا تُستلم دفعة عبر أي قناة؛ الرسائل للأسئلة والاتجاهات فقط، والشراء يتم عند الطاولة.",
        },
      ],
    },
    zh: {
      sections: [
        {
          h2: "这是哪一家店，又不是哪一家",
          body:
            "芭提雅不止一家门店用同样两三个词拼出的名字，搜索引擎也经常把它们弄混。十秒钟的核对就能定下来：招牌写着 LABS DISPENSARY，地址是南芭提雅 32 Pattaya 13 Alley，门上的电话与本站公布的号码一致。三者中只要有一项对不上，你面前的就是另一家生意，而不是我们的分店——因为我们没有分店。",
        },
        {
          h2: "本店不卖什么",
          body:
            "不卖电子烟，也不卖任何形式的烟草制品。这不是偏好问题：电子烟在泰国禁止销售，而把它们悄悄放在柜台下面的店，是拿开门营业所依赖的牌照去赌。这里是按受管制草药规则运营的花柜台，所有东西都当面交付给持泰国签发处方、年满 20 岁的成年人。",
        },
      ],
      faq: [
        {
          q: "怎么确认是这家店而不是名字相近的另一家？",
          a: "核对三样：LABS DISPENSARY 招牌、地址 32 Pattaya 13 Alley，以及本站公布的电话。我们没有分店，同名的第二个地址就是别人。",
        },
        {
          q: "可以通过社交媒体下单吗？",
          a: "不可以。任何渠道都不接受下单与付款，消息只用于询问与问路，购买在柜台完成。",
        },
      ],
    },
    ko: {
      sections: [
        {
          h2: "여기가 어떤 매장이고, 어떤 매장이 아닌지",
          body:
            "파타야에는 같은 두세 단어를 조합한 이름을 쓰는 업체가 하나가 아니고, 검색엔진도 이를 자주 뒤섞습니다. 확인은 십 초면 끝납니다. 간판에는 LABS DISPENSARY, 주소는 남파타야 32 Pattaya 13 Alley, 문에 적힌 전화번호는 이 사이트에 실린 번호와 같습니다. 셋 중 하나라도 맞지 않으면 그곳은 다른 업체이며 우리 지점도 아닙니다. 지점은 없습니다.",
        },
        {
          h2: "여기서 팔지 않는 것",
          body:
            "전자담배와 담배 제품은 어떤 형태로도 취급하지 않습니다. 취향의 문제가 아니라 태국에서 전자담배 판매가 금지되어 있기 때문이며, 그것을 카운터 밑에 숨겨 두는 매장은 문을 열게 해 주는 허가를 걸고 도박을 하는 매장입니다. 이곳은 관리 대상 약초 규정에 따라 운영되는 꽃 카운터이고, 나가는 모든 것은 태국에서 발급된 처방전을 지닌 20세 이상 성인에게 직접 전달됩니다.",
        },
      ],
      faq: [
        {
          q: "이름이 비슷한 다른 매장이 아니라 이곳인지 어떻게 확인하나요?",
          a: "세 가지를 맞춰 보세요. LABS DISPENSARY 간판, 주소 32 Pattaya 13 Alley, 그리고 이 사이트에 공개된 전화번호입니다. 지점이 없으므로 같은 이름의 두 번째 주소는 다른 곳입니다.",
        },
        {
          q: "소셜미디어로 주문을 받나요?",
          a: "받지 않습니다. 어떤 채널에서도 주문과 결제를 받지 않으며, 메시지는 질문과 길 안내용입니다. 구매는 카운터에서 이루어집니다.",
        },
      ],
    },
    ja: {
      sections: [
        {
          h2: "ここがどの店で、どの店ではないのか",
          body:
            "パタヤには同じ二つ三つの語を組み合わせた名前の事業者が複数あり、検索エンジンも頻繁に取り違えます。確認は十秒で済みます。看板は LABS DISPENSARY、住所は南パタヤの 32 Pattaya 13 Alley、扉に書かれた電話番号はこのサイトに載る番号と同じ。三つのうち一つでも合わなければ、それは別の事業者であり、当店の支店でもありません。支店はないからです。",
        },
        {
          h2: "ここで扱わないもの",
          body:
            "電子たばこも、いかなる形態のたばこ製品も扱いません。好みの問題ではなく、タイでは電子たばこの販売が禁止されているためで、それをカウンターの下に置いておく店は、営業を成り立たせている許可を賭けている店です。ここは管理対象ハーブの規定に沿って運営する花のカウンターで、渡されるものはすべて、タイで発行された処方を持つ20歳以上の方へ対面で手渡されます。",
        },
      ],
      faq: [
        {
          q: "名前の似た別の店ではなく、この店だとどう確かめますか？",
          a: "三つを照合してください。LABS DISPENSARY の看板、住所 32 Pattaya 13 Alley、そしてこのサイトに掲載の電話番号です。支店はないので、同名の二つ目の住所は別の事業者です。",
        },
        {
          q: "SNSから注文できますか？",
          a: "できません。どの窓口でも注文や支払いは受け付けず、メッセージは質問と道案内のためのものです。購入はカウンターで行います。",
        },
      ],
    },
  },
  "cannabis-near-me-pattaya": {
    en: {
      sections: [
        {
          h2: "How “near me” actually behaves in Pattaya",
          body:
            "A near-me search does not return the best shops in the city, and it does not return a stable list. It returns what is close to the point your phone thinks you are standing on, reordered every time you move a few streets — which is why the result from your hotel lobby and the result from the beach are different. In a city with several hundred licensed shops, proximity is doing most of the work in that ranking, and proximity says nothing about what is in the jars.",
        },
        {
          h2: "Telling the right door from its neighbours in the same alley",
          body:
            "The failure mode of a near-me search in Pattaya is not that it sends you somewhere bad, it is that it sends you to the right alley and the wrong door. Numbered alleys here carry several shops within thirty metres of each other, some of them with names built from the same two or three English words. Before you walk in, read the sign against the listing you tapped — the whole name, not the first word — and check the house number, because the number is the thing that cannot be shared. If the listing shows photographs, look at the doorway rather than at the product shots: a doorway is unmistakable and a jar is not. And when the map pin lands you between two entrances, the phone number in the listing settles it in one call.",
        },
      ],
      faq: [
        {
          q: "Why do I get different shops every time I search near me?",
          a: "Because the ranking is rebuilt from wherever your phone thinks you are. Move a few streets and the order changes; the list is a proximity list, not a quality list.",
        },
        {
          q: "Is the nearest shop the right shop?",
          a: "Not automatically. Nearest is a distance, not a standard. Check the licence on the wall, whether documents are asked for, and whether the jar is opened in front of you.",
        },
      ],
    },
    ru: {
      sections: [
        {
          h2: "Как на самом деле работает поиск «рядом со мной» в Паттайе",
          body:
            "Поиск «рядом» не выдаёт список хороших магазинов города и вообще не выдаёт устойчивый список. Он выдаёт то, что близко к точке, в которой телефон считает вас находящимся, и пересобирает выдачу каждый раз, когда вы отходите на пару кварталов, — поэтому результат из лобби отеля и результат с пляжа разные. В городе с несколькими сотнями лицензированных магазинов основную работу в этом ранжировании делает близость, а близость ничего не говорит о том, что стоит в банках.",
        },
        {
          h2: "Как отличить нужную дверь от соседних в том же переулке",
          body:
            "Поиск «рядом» в Паттайе ошибается не тем, что приводит в плохое место, а тем, что приводит в нужный переулок и не к той двери. В нумерованных переулках стоят по несколько магазинов в тридцати метрах друг от друга, и часть из них носит названия, собранные из тех же двух-трёх английских слов. Перед тем как зайти, сверьте вывеску с карточкой, по которой вы шли, — название целиком, а не первое слово, — и посмотрите номер дома: номер как раз общим не бывает. Если в карточке есть фотографии, смотрите на вход, а не на снимки товара: вход опознаётся однозначно, банка — нет. А когда пин на карте встаёт между двумя входами, вопрос решает один звонок по номеру из карточки.",
        },
      ],
      faq: [
        {
          q: "Почему поиск «рядом» каждый раз показывает разные магазины?",
          a: "Потому что выдача пересобирается от точки, в которой находится телефон. Отошли на пару кварталов — порядок изменился. Это список по близости, а не по качеству.",
        },
        {
          q: "Ближайший магазин — значит подходящий?",
          a: "Не автоматически. Ближайший — это расстояние, а не стандарт. Смотрите на лицензию на стене, на то, спрашивают ли документы, и на то, открывают ли банку при вас.",
        },
      ],
    },
    th: {
      sections: [
        {
          h2: "คำค้น “ใกล้ฉัน” ทำงานอย่างไรในพัทยา",
          body:
            "การค้นหาแบบใกล้ฉันไม่ได้คืนรายชื่อร้านที่ดีของเมือง และไม่ได้คืนรายการที่คงที่ด้วย มันคืนสิ่งที่อยู่ใกล้จุดที่โทรศัพท์คิดว่าคุณยืนอยู่ และจัดลำดับใหม่ทุกครั้งที่คุณขยับไปสองสามช่วงถนน ผลจากล็อบบี้โรงแรมกับผลจากชายหาดจึงไม่เหมือนกัน ในเมืองที่มีร้านมีใบอนุญาตหลายร้อยแห่ง ระยะทางคือสิ่งที่กำหนดลำดับเป็นหลัก และระยะทางไม่ได้บอกอะไรเลยเกี่ยวกับสิ่งที่อยู่ในโหล",
        },
        {
          h2: "สี่ข้อที่ควรดูก่อนเดินเข้าไป",
          body:
            "ไม่ว่าแผนที่จะพาไปที่ไหน หน้าประตูมีสี่อย่างให้ดู มีใบอนุญาตติดไว้ในที่ที่ลูกค้าอ่านได้ไหม มีคนถามอายุและขอดูเอกสารก่อนจะคุยเรื่องของหรือเปล่า เปิดโหลให้ดูต่อหน้าหรือยื่นของที่แบ่งไว้แล้วจากชั้นหลัง และที่อยู่บนป้ายตรงกับที่อยู่ในแผนที่ที่คุณกดมาหรือไม่ ร้านที่ตกข้อสองไม่ได้กำลังใจดีกับคุณ",
        },
      ],
      faq: [
        {
          q: "ทำไมค้นหาใกล้ฉันแล้วได้ร้านไม่ซ้ำกันทุกครั้ง?",
          a: "เพราะลำดับถูกจัดใหม่จากตำแหน่งที่โทรศัพท์ระบุ ขยับไปสองสามช่วงถนนลำดับก็เปลี่ยน นี่คือรายการตามระยะทาง ไม่ใช่ตามคุณภาพ",
        },
        {
          q: "ร้านที่ใกล้ที่สุดคือร้านที่ใช่หรือเปล่า?",
          a: "ไม่เสมอไป ใกล้คือระยะทาง ไม่ใช่มาตรฐาน ดูใบอนุญาตบนผนัง ดูว่ามีการขอเอกสารไหม และดูว่าเปิดโหลต่อหน้าคุณหรือไม่",
        },
      ],
    },
    ar: {
      sections: [
        {
          h2: "كيف يتصرف بحث «بالقرب مني» في باتايا فعليا",
          body:
            "بحث «بالقرب مني» لا يعيد أفضل المتاجر في المدينة ولا يعيد قائمة ثابتة أصلا. إنه يعيد ما هو قريب من النقطة التي يظن هاتفك أنك تقف عليها، ويعيد ترتيبها كلما تحركت بضعة شوارع، ولهذا تختلف النتيجة في بهو الفندق عنها على الشاطئ. وفي مدينة فيها مئات المتاجر المرخصة، القرب هو ما يحرك هذا الترتيب، والقرب لا يقول شيئا عما بداخل الأوعية.",
        },
        {
          h2: "فحص دقيقة واحدة قبل الدخول",
          body:
            "مهما وضعت الخريطة أمامك، هناك أربعة أمور تستحق النظر عند الباب: هل الرخصة معلقة حيث يمكن للزبون قراءتها، وهل يسأل أحد عن عمرك وأوراقك قبل أن يتحول الحديث إلى المنتج، وهل يُفتح الوعاء أمامك بدل تسليم كمية معبأة مسبقا من رف خلفي، وهل يطابق العنوان على اللافتة العنوان في البطاقة التي ضغطت عليها. المتجر الذي يسقط في النقطة الثانية لا يسدي إليك معروفا بتساهله.",
        },
      ],
      faq: [
        {
          q: "لماذا تتغير المتاجر في كل مرة أبحث فيها بالقرب مني؟",
          a: "لأن الترتيب يُبنى من موضع هاتفك. تحرك بضعة شوارع فيتغير الترتيب؛ إنها قائمة قرب لا قائمة جودة.",
        },
        {
          q: "هل المتجر الأقرب هو المتجر المناسب؟",
          a: "ليس تلقائيا. الأقرب مسافة لا معيار. انظر إلى الرخصة على الجدار، وإلى طلب الأوراق، وإلى فتح الوعاء أمامك.",
        },
      ],
    },
    zh: {
      sections: [
        {
          h2: "“附近”搜索在芭提雅到底是怎么排的",
          body:
            "附近搜索并不会给出全城更好的门店，也不会给出一份稳定的名单。它给出的是靠近手机认为你所在位置的结果，你走出几条街它就重排一次——所以在酒店大堂搜到的和在海滩搜到的并不一样。在一座有几百家持牌门店的城市里，决定这个排序的主要是距离，而距离对罐子里装着什么一句话也没说。",
        },
        {
          h2: "进门前值得花一分钟看的四件事",
          body:
            "无论地图把你带到哪里，门口都有四件事值得看一眼：牌照是否挂在顾客能读到的地方；有没有人先问年龄和证件，再谈产品；罐子是当着你的面打开，还是从后面架子上拿出已经分装好的；招牌上的地址是否与你点开的地图信息一致。第二条不合格的店，不是待客随和，而是在告诉你它怎么对待规则。",
        },
      ],
      faq: [
        {
          q: "为什么每次搜索附近的店结果都不一样？",
          a: "因为排序会依据手机所在的位置重新生成。走出几条街顺序就变了；这是按距离排的名单，不是按品质排的。",
        },
        {
          q: "最近的店就是合适的店吗？",
          a: "不一定。最近只是距离，不是标准。看墙上的牌照、是否查验证件、罐子是否当面打开。",
        },
      ],
    },
    ko: {
      sections: [
        {
          h2: "파타야에서 ‘내 주변’ 검색은 실제로 어떻게 작동하나",
          body:
            "내 주변 검색은 도시에서 더 나은 매장을 돌려주지 않고, 고정된 목록조차 돌려주지 않습니다. 휴대폰이 판단한 현재 위치에서 가까운 곳을 돌려주고, 몇 블록만 움직여도 순서를 다시 만듭니다. 호텔 로비에서의 결과와 해변에서의 결과가 다른 이유입니다. 허가받은 매장이 수백 곳인 도시에서 그 순위를 움직이는 것은 대부분 거리이고, 거리는 병 안에 무엇이 들었는지에 대해 아무 말도 하지 않습니다.",
        },
        {
          h2: "들어가기 전 일 분이면 되는 확인",
          body:
            "지도가 어디로 데려갔든 문 앞에서 볼 것은 네 가지입니다. 허가증이 손님이 읽을 수 있는 곳에 걸려 있는지. 제품 이야기로 넘어가기 전에 나이와 서류를 묻는지. 병을 앞에서 여는지, 아니면 뒤쪽 선반에서 미리 담아 둔 것을 건네는지. 간판의 주소가 눌러서 들어온 지도 정보의 주소와 같은지. 두 번째에서 걸리는 매장은 너그러운 것이 아닙니다.",
        },
      ],
      faq: [
        {
          q: "내 주변을 검색할 때마다 매장이 달라지는 이유는?",
          a: "휴대폰이 인식한 위치를 기준으로 순위가 다시 만들어지기 때문입니다. 몇 블록만 움직여도 순서가 바뀌며, 이는 품질 목록이 아니라 거리 목록입니다.",
        },
        {
          q: "가장 가까운 매장이 맞는 매장인가요?",
          a: "저절로 그렇지는 않습니다. 가장 가깝다는 것은 거리이지 기준이 아닙니다. 벽의 허가증, 서류 확인 여부, 병을 앞에서 여는지를 보세요.",
        },
      ],
    },
    ja: {
      sections: [
        {
          h2: "パタヤで「近くの」検索が実際にしていること",
          body:
            "近くの検索は、街で良い店を返すわけでも、安定した一覧を返すわけでもありません。返るのは、端末があなたの現在地だと判断した点に近いもので、数ブロック動くたびに並べ替えられます。ホテルのロビーで見た結果とビーチで見た結果が違うのはそのためです。許可店が数百軒ある街では、その並びを動かしているのはおおむね距離であり、距離は瓶の中身について何も語りません。",
        },
        {
          h2: "入る前の一分でできる確認",
          body:
            "地図がどこへ導いたとしても、扉の前で見るべきものは四つです。許可証が客の読める場所に掲示されているか。商品の話に移る前に年齢と書類を尋ねるか。瓶をその場で開けるのか、奥の棚から小分け済みのものを渡すのか。看板の住所が、あなたがタップしたリスティングの住所と一致しているか。二つ目で引っかかる店は、寛容なのではありません。",
        },
      ],
      faq: [
        {
          q: "近くの店を検索するたびに結果が変わるのはなぜですか？",
          a: "端末が認識した位置から順位が作り直されるためです。数ブロック動けば並びは変わります。これは品質の一覧ではなく距離の一覧です。",
        },
        {
          q: "いちばん近い店が適切な店ですか？",
          a: "自動的にそうとは言えません。近さは距離であって基準ではありません。壁の許可証、書類を確認するか、瓶をその場で開けるかを見てください。",
        },
      ],
    },
  },
  "buy-cannabis-pattaya": {
    en: {
      sections: [
        {
          h2: "What the purchase looks like, step by step",
          body:
            "You come in, and the first thing that happens is the check: age 20 or over, passport in original form, prescription. Then it becomes a conversation. You say what you are after — or that you have no idea, which is a perfectly normal answer — and jars come out onto the counter to be opened, looked at and smelled. Nothing is pre-packed out of sight, nothing is decided for you, and there is no hurry built into the process. What you take is handed to you there, and that is the whole transaction.",
        },
        {
          h2: "First time in Thailand: describe the evening, not the strain name",
          body:
            "Strain names travel badly. The same three or four names appear on shelves across Asia attached to genuinely different plants, so a name you liked in another country is a weak instruction. What works is describing the situation: an evening on a balcony with nothing planned afterwards, or a couple of hours before dinner with people you have just met. Say roughly how often you use, and say if the answer is rarely — a smaller amount of something gentler is the sensible first purchase, and any counter worth standing at will tell you the same.",
        },
      ],
      faq: [
        {
          q: "Can I buy on my first day in Pattaya?",
          a: "That depends entirely on your documents, not on your schedule. You need to be 20 or over with a passport and a prescription issued in Thailand. Without the prescription, the counter cannot serve you.",
        },
        {
          q: "How much can I buy at once?",
          a: "A prescription covers a supply of no more than 30 days, and an individual document can be narrower. Nothing here quotes amounts or figures — that conversation happens at the counter with your document in front of you.",
        },
      ],
    },
    ru: {
      sections: [
        {
          h2: "Как проходит покупка, по шагам",
          body:
            "Вы заходите, и первое, что происходит, — проверка: 20+, паспорт в оригинале, рецепт. Дальше начинается разговор. Вы говорите, что ищете, — или что пока не представляете, и это нормальный ответ, — и на прилавок выставляют банки, которые открывают, показывают и дают понюхать. Ничего не фасуется вне поля зрения, ничего не решают за вас, и спешка в процесс не встроена. То, что вы берёте, отдают здесь же, и на этом сделка заканчивается.",
        },
        {
          h2: "Первый раз в Таиланде: описывайте вечер, а не название сорта",
          body:
            "Названия сортов плохо переносят дорогу. Одни и те же три-четыре имени стоят на полках по всей Азии на заметно разных растениях, поэтому название, которое вам понравилось в другой стране, — слабая инструкция. Работает описание ситуации: вечер на балконе, когда после уже ничего не планируется, или пара часов перед ужином в компании, с которой вы только познакомились. Скажите, как часто вы вообще употребляете, и скажите прямо, если редко: разумная первая покупка — меньше и мягче, и любой прилавок, у которого стоит стоять, скажет вам то же самое.",
        },
      ],
      faq: [
        {
          q: "Можно ли купить в первый же день в Паттайе?",
          a: "Это зависит от документов, а не от расписания. Нужны 20+, паспорт и рецепт, выданный в Таиланде. Без рецепта прилавок вас обслужить не может.",
        },
        {
          q: "Сколько можно взять за раз?",
          a: "Рецепт покрывает запас не более чем на 30 дней, а конкретный документ может быть уже. Никаких количеств и цифр здесь не публикуется: этот разговор происходит у прилавка, когда ваш документ лежит перед вами.",
        },
      ],
    },
  },
  "best-cannabis-shop-pattaya": {
    en: {
      sections: [
        {
          h2: "Four things worth checking in any Pattaya shop",
          body:
            "One: a licence from the Ministry of Public Health, displayed where a customer can read it rather than kept in a drawer. Two: staff who ask for age and documents before the conversation turns to product. Three: jars opened in front of you, so that what you smell is what you take. Four: someone behind the counter who is willing to say “I don't know” instead of inventing an answer about where a batch came from. None of those four require you to know anything about cannabis, which is exactly why they are the useful tests.",
        },
        {
          h2: "Why the review count is a weak signal here",
          body:
            "Most of the shops in this city opened within the same eighteen months, so a review total mostly measures how long a place has been collecting them and how much foot traffic its street gets. A shop on a tourist strip will out-review a better shop on a side soi without being better at anything. Read the recent reviews instead of the number, and read the ones with complaints in them: what a shop is criticised for tells you more about how it behaves than a four-word compliment does.",
        },
      ],
      faq: [
        {
          q: "How do I compare shops if nobody publishes prices?",
          a: "By the four checks set out above, all of which are visible at the door. Advertising cannabis is prohibited through all channels in Thailand, so no licensed shop publishes a list, and a shop that does is telling you something about itself.",
        },
        {
          q: "Does a big review count mean a better shop?",
          a: "It mostly means an older listing on a busier street. Read the recent reviews and the critical ones rather than the total.",
        },
      ],
    },
    ru: {
      sections: [
        {
          h2: "Четыре вещи, которые стоит проверить в любом магазине Паттайи",
          body:
            "Первое: лицензия Министерства здравоохранения, вывешенная там, где посетитель может её прочитать, а не лежащая в ящике. Второе: персонал, который спрашивает возраст и документы до того, как разговор перейдёт к товару. Третье: банки открывают при вас, чтобы то, что вы нюхаете, и было тем, что вы возьмёте. Четвёртое: человек за прилавком, готовый сказать «не знаю» вместо того, чтобы выдумать историю про партию. Ни один из четырёх пунктов не требует от вас разбираться в каннабисе — именно поэтому они и работают.",
        },
        {
          h2: "Почему число отзывов — слабый сигнал",
          body:
            "Большинство магазинов в этом городе открылись в пределах одних и тех же полутора лет, поэтому счётчик отзывов измеряет в основном возраст карточки и проходимость улицы. Магазин на туристической полосе наберёт больше отзывов, чем магазин в переулке, ни в чём его не превосходя. Читайте свежие отзывы вместо числа и читайте те, где жалуются: то, за что магазин ругают, говорит о его поведении больше, чем комплимент в четыре слова.",
        },
      ],
      faq: [
        {
          q: "Как сравнивать магазины, если цен никто не публикует?",
          a: "Сравнивайте то, что видно: лицензию на стене, проверяют ли документы, открывают ли банку при вас и как отвечают на вопросы. Реклама каннабиса в Таиланде запрещена во всех каналах, поэтому прайс не публикует ни один лицензированный магазин.",
        },
        {
          q: "Много отзывов — значит хороший магазин?",
          a: "Чаще это значит более старую карточку на более людной улице. Читайте свежие и критические отзывы, а не итоговое число.",
        },
      ],
    },
  },
  "cheap-weed-pattaya": {
    en: {
      sections: [
        {
          h2: "What a cheaper jar usually turns out to be",
          body:
            "In practice it is one of four things, and you can spot all of them without any expertise. Old flower, which has lost most of its smell and crumbles to dust between your fingers instead of breaking. Over-dried flower, same symptom, different cause. Machine-trimmed flower, where the shape is chewed and leaf is left in. Or outdoor-grown flower, looser and lighter, which some people are perfectly happy with. None of that is fraud, and none of it is hidden from you — it is simply what the lower end of any shelf, in any city, is made of.",
        },
        {
          h2: "Questions that get you a straight answer about value",
          body:
            "Ask when it was harvested and how long it was cured — a shop that knows will tell you, and a shop that does not know has just told you something too. Ask whether it was grown indoors or outdoors. Ask to smell the jar rather than a bag. And ask the person behind the counter which one they would take home for themselves, which is the question that separates a counter that sells from a counter that shifts stock. Then buy less of something you liked rather than more of something you did not.",
        },
      ],
      faq: [
        {
          q: "Can you tell me what things cost before I come?",
          a: "Advertising cannabis is prohibited through all channels in Thailand, so nothing here or in a message quotes a figure. You will see what is what at the counter, and you are free to walk away.",
        },
        {
          q: "Is cheaper flower bad flower?",
          a: "Not necessarily — it is usually older, drier, machine-trimmed or outdoor-grown. Look at it, smell it, and decide whether that trade-off suits you. Less of something fresh often beats more of something tired.",
        },
      ],
    },
    ru: {
      sections: [
        {
          h2: "Чем обычно оказывается банка подешевле",
          body:
            "На практике это одно из четырёх, и всё четыре видно без всякой экспертизы. Лежалый цветок, который потерял запах и крошится в пыль между пальцами вместо того, чтобы ломаться. Пересушенный — тот же симптом, другая причина. Обрезанный машиной, с пожёванной формой и оставленным листом. Или выращенный на улице, более рыхлый и лёгкий, что кого-то полностью устраивает. Ничто из этого не обман и ничто не прячут: так устроен нижний край любой полки в любом городе.",
        },
        {
          h2: "Вопросы, после которых становится понятно, за что вы платите",
          body:
            "Спросите, когда собрано и сколько сушилось и вызревало: магазин, который знает, ответит, а магазин, который не знает, тоже кое-что этим сказал. Спросите, помещение это было или улица. Попросите понюхать банку, а не пакет. И спросите человека за прилавком, что из этого он взял бы себе, — именно этот вопрос отделяет прилавок, который продаёт, от прилавка, который сбывает остатки. А дальше берите меньше того, что понравилось, вместо большего количества того, что нет.",
        },
      ],
      faq: [
        {
          q: "Можно узнать, во что это обойдётся, до приезда?",
          a: "Реклама каннабиса в Таиланде запрещена во всех каналах, поэтому ни здесь, ни в переписке цифр нет. Всё будет видно у прилавка, и уйти без покупки вы вправе.",
        },
        {
          q: "Дешевле — значит плохо?",
          a: "Не обязательно: обычно это более лежалое, пересушенное, обрезанное машиной или выращенное на улице. Посмотрите, понюхайте и решите, устраивает ли вас такой размен. Меньше свежего часто лучше, чем больше уставшего.",
        },
      ],
    },
  },
};

export function getPageDepth(locale: Locale, slug: string): DepthContent | null {
  return PAGE_DEPTH[slug]?.[locale] ?? null;
}
