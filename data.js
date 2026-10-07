// Учебные данные. Формат слов: "english|перевод|пример". Можно свободно дополнять.
const DATA = {};

DATA.words = {
A1: `
hello|привет|Hello, how are you?
time|время|What time is it?
day|день|Have a nice day!
week|неделя|I work five days a week.
year|год|She is ten years old.
family|семья|I love my family.
friend|друг|He is my best friend.
house|дом|They live in a big house.
water|вода|Can I have some water?
food|еда|The food here is great.
money|деньги|I don't have much money.
work|работа; работать|I work in an office.
city|город|London is a big city.
street|улица|I live on this street.
car|машина|My car is red.
book|книга|I'm reading a good book.
morning|утро|I drink coffee every morning.
night|ночь|Good night!
eat|есть, кушать|We eat dinner at seven.
drink|пить|I drink tea every day.
sleep|спать|I sleep eight hours.
go|идти, ехать|Let's go home.
come|приходить|Come here, please.
see|видеть|I can see the sea.
know|знать|I don't know.
want|хотеть|I want a coffee.
like|нравиться|I like music.
love|любить|I love this song.
help|помогать|Can you help me?
buy|покупать|I need to buy milk.
open|открывать|Open the door, please.
close|закрывать|Close the window.
big|большой|It's a big dog.
small|маленький|I have a small flat.
good|хороший|This is a good idea.
bad|плохой|The weather is bad today.
new|новый|I have a new phone.
old|старый|This is an old town.
happy|счастливый|I'm happy to see you.
hungry|голодный|I'm hungry.
tired|уставший|I'm very tired today.
cold|холодный|It's cold outside.
hot|горячий, жаркий|The tea is hot.
cheap|дешёвый|This shirt is cheap.
expensive|дорогой|That car is expensive.
fast|быстрый|He is a fast runner.
slow|медленный|The bus is slow.
today|сегодня|What are you doing today?
tomorrow|завтра|See you tomorrow!
yesterday|вчера|I was at home yesterday.
always|всегда|She is always late.
never|никогда|I never eat meat.
often|часто|We often go to the park.
sometimes|иногда|Sometimes I work at home.
here|здесь|I live here.
there|там|Put it there.
weather|погода|The weather is nice.
shop|магазин|The shop opens at nine.
breakfast|завтрак|I have breakfast at eight.
dinner|ужин|What's for dinner?
job|работа (должность)|She has a new job.
child|ребёнок|They have one child.
people|люди|There are many people here.
room|комната|My room is small.
door|дверь|Knock on the door.
window|окно|Open the window.
phone|телефон|Where is my phone?
question|вопрос|Can I ask a question?
answer|ответ; отвечать|I know the answer.
learn|учить, изучать|I learn English every day.
speak|говорить|Do you speak English?
read|читать|I read every evening.
write|писать|Write your name here.
listen|слушать|Listen to me.
understand|понимать|I don't understand.
ask|спрашивать|Ask the teacher.
wait|ждать|Wait a minute!
live|жить|Where do you live?
begin|начинать|The film begins at eight.
finish|заканчивать|I finish work at six.
walk|гулять, идти пешком|I walk to work.
run|бегать|I run every morning.
play|играть|The kids play football.
watch|смотреть|We watch TV in the evening.
pay|платить|Can I pay by card?
cost|стоить|How much does it cost?
easy|лёгкий|This test is easy.
difficult|трудный|English is not difficult.
beautiful|красивый|What a beautiful day!
right|правильный; правый|You are right.
wrong|неправильный|That's the wrong answer.
early|рано|I get up early.
late|поздно|Sorry, I'm late.
ticket|билет|I need a ticket to Paris.
train|поезд|The train is late.
airport|аэропорт|Take me to the airport.
holiday|отпуск, праздник|We are on holiday.
birthday|день рождения|Happy birthday!
clothes|одежда|I need new clothes.
hospital|больница|She works in a hospital.
doctor|врач|You should see a doctor.
`,
A2: `
already|уже|I have already eaten.
yet|ещё (в вопросах и отрицаниях)|I haven't finished yet.
still|всё ещё|She is still at work.
ago|назад (о времени)|I met him two years ago.
during|во время|I slept during the film.
until|до (тех пор, пока)|Wait until I come back.
enough|достаточно|I don't have enough time.
almost|почти|It's almost ten o'clock.
probably|вероятно|It will probably rain.
especially|особенно|I love fruit, especially apples.
borrow|брать взаймы|Can I borrow your pen?
lend|давать взаймы|Can you lend me some money?
forget|забывать|Don't forget your keys.
remember|помнить|I remember your name.
decide|решать|We decided to stay home.
choose|выбирать|Choose one colour.
explain|объяснять|Can you explain this word?
agree|соглашаться|I agree with you.
travel|путешествовать|I love to travel.
arrive|прибывать|We arrived at midnight.
leave|уходить, уезжать; оставлять|The train leaves at five.
spend|тратить; проводить (время)|I spend a lot on food.
save|копить; спасать|I'm saving money for a car.
win|выигрывать|Our team won the match.
lose|терять; проигрывать|I lost my keys.
try|пытаться; пробовать|Try this cake!
change|менять; сдача|I want to change my job.
believe|верить|I don't believe you.
hope|надеяться|I hope you are well.
worry|беспокоиться|Don't worry about it.
invite|приглашать|They invited us to dinner.
order|заказывать; порядок|Are you ready to order?
book a table|забронировать столик|I want to book a table for two.
rent|арендовать; арендная плата|We rent a flat in the centre.
neighbour|сосед|My neighbour is very friendly.
journey|поездка, путешествие|Have a safe journey!
luggage|багаж|Where can I leave my luggage?
appointment|встреча, запись (к врачу)|I have a dentist appointment.
meeting|встреча, совещание|The meeting starts at ten.
mistake|ошибка|Everyone makes mistakes.
advice|совет|Can you give me some advice?
health|здоровье|Sport is good for your health.
salary|зарплата|He has a good salary.
skill|навык|Cooking is a useful skill.
goal|цель|My goal is to speak English.
dream|мечта; мечтать|It's my dream job.
problem|проблема|No problem!
reason|причина|Tell me the reason.
choice|выбор|You have no choice.
experience|опыт|She has a lot of experience.
opinion|мнение|In my opinion, it's a good idea.
weekend|выходные|What are you doing at the weekend?
dangerous|опасный|This road is dangerous.
safe|безопасный|Is it safe here?
busy|занятой|I'm busy right now.
free|свободный; бесплатный|Are you free tonight?
boring|скучный|The film was boring.
interesting|интересный|What an interesting story!
famous|известный|He is a famous actor.
healthy|здоровый, полезный|I try to eat healthy food.
quiet|тихий|It's a quiet street.
loud|громкий|The music is too loud.
empty|пустой|The fridge is empty.
full|полный; сытый|The bus is full.
ready|готовый|Are you ready?
sure|уверенный|Are you sure?
afraid|испуганный; боюсь, что|I'm afraid of dogs.
angry|злой, сердитый|Why are you angry?
proud|гордый|I'm proud of you.
pleasant|приятный|It was a pleasant evening.
own|собственный|I have my own room.
huge|огромный|They have a huge house.
crowded|переполненный|The metro is crowded.
abroad|за границей|She lives abroad.
instead|вместо этого|Let's have tea instead.
anyway|в любом случае; так или иначе|Anyway, let's go.
outside|снаружи, на улице|Let's eat outside.
upstairs|наверху|My room is upstairs.
get up|вставать|I get up at seven.
look for|искать|I'm looking for my phone.
turn on|включать|Turn on the light.
turn off|выключать|Turn off your phone.
put on|надевать|Put on your coat.
take off|снимать; взлетать|Take off your shoes.
find out|выяснять, узнавать|I want to find out the truth.
give up|бросать, сдаваться|Don't give up!
pick up|поднимать; забирать|I'll pick you up at six.
grow up|вырастать|I grew up in Moscow.
fill in|заполнять|Fill in this form.
wake up|просыпаться|I woke up late.
look after|заботиться, присматривать|She looks after her sister.
`,
B1: `
achieve|достигать|She achieved her goal.
improve|улучшать|I want to improve my English.
develop|развивать|We need to develop new skills.
manage|справляться; управлять|I managed to finish on time.
avoid|избегать|Try to avoid sugar.
suggest|предлагать|I suggest we take a taxi.
require|требовать|This job requires experience.
provide|предоставлять|The hotel provides breakfast.
include|включать (в себя)|The price includes tax.
prefer|предпочитать|I prefer tea to coffee.
expect|ожидать|I didn't expect to see you.
realise|осознавать|I realised I was wrong.
admit|признавать|He admitted his mistake.
deny|отрицать|She denied everything.
refuse|отказываться|He refused to help.
afford|позволить себе (по деньгам)|I can't afford a new car.
apply|подавать заявку|I applied for a job.
complain|жаловаться|They complained about the noise.
convince|убеждать|You convinced me.
persuade|уговаривать|She persuaded me to go.
encourage|поощрять, вдохновлять|My parents encouraged me.
compare|сравнивать|Don't compare yourself to others.
consider|рассматривать, обдумывать|We are considering moving.
pretend|притворяться|He pretended to be asleep.
mention|упоминать|Don't mention it.
recognise|узнавать (кого-то)|I didn't recognise you.
increase|увеличивать(ся)|Prices increased again.
reduce|сокращать|We need to reduce costs.
solve|решать (проблему)|We solved the problem.
deal with|иметь дело с, справляться|I'll deal with it.
depend on|зависеть от|It depends on the weather.
get rid of|избавиться от|I want to get rid of old clothes.
come up with|придумать|She came up with a great idea.
run out of|закончиться (о запасах)|We ran out of milk.
put off|откладывать|Don't put off your work.
carry on|продолжать|Carry on working.
figure out|разобраться, понять|I can't figure out this problem.
set up|основать; настроить|He set up his own company.
turn down|отклонять; убавлять|She turned down the offer.
get along with|ладить с|I get along with my boss.
look forward to|с нетерпением ждать|I look forward to hearing from you.
take care of|заботиться о|Take care of yourself.
make sense|иметь смысл|That makes sense.
on purpose|нарочно|He did it on purpose.
by accident|случайно|I deleted it by accident.
in advance|заранее|Book tickets in advance.
at least|по крайней мере|At least try it.
however|однако|However, it's not easy.
although|хотя|Although it was late, we went out.
therefore|поэтому, следовательно|He was ill; therefore he stayed home.
unless|если не|I won't go unless you come.
whether|ли (whether ... or)|I don't know whether he's coming.
otherwise|иначе|Hurry up, otherwise we'll be late.
eventually|в конце концов|Eventually, he agreed.
recently|недавно|I've recently started yoga.
actually|на самом деле|Actually, I like it.
obviously|очевидно|Obviously, he was tired.
completely|полностью|I completely forgot.
environment|окружающая среда|We must protect the environment.
opportunity|возможность|It's a great opportunity.
knowledge|знания|Knowledge is power.
behaviour|поведение|His behaviour was strange.
relationship|отношения|They have a good relationship.
success|успех|The party was a success.
failure|неудача|Failure is part of learning.
effort|усилие|It takes a lot of effort.
purpose|цель, назначение|What's the purpose of your visit?
attitude|отношение, позиция|She has a positive attitude.
benefit|польза, выгода|Exercise has many benefits.
challenge|вызов, трудная задача|Learning a language is a challenge.
decision|решение|It was a hard decision.
average|средний|The average age is 30.
available|доступный, свободный|Is this room available?
reliable|надёжный|He is a reliable friend.
responsible|ответственный|Who is responsible for this?
confident|уверенный в себе|She feels confident.
grateful|благодарный|I'm grateful for your help.
embarrassed|смущённый|I was so embarrassed.
disappointed|разочарованный|I'm disappointed with the result.
annoying|раздражающий|That noise is annoying.
impressive|впечатляющий|Your English is impressive.
obvious|очевидный|The answer is obvious.
similar|похожий|Our ideas are similar.
necessary|необходимый|Is it necessary?
rare|редкий|It's a rare bird.
worth|стоящий|This film is worth watching.
aware|осведомлённый|Are you aware of the risks?
tough|трудный; жёсткий|It was a tough day.
lazy|ленивый|Don't be lazy!
polite|вежливый|Be polite to people.
rude|грубый|That was rude.
honest|честный|To be honest, I don't know.
`,
B2: `
assume|предполагать|I assume you know him.
undergo|подвергаться, проходить (через)|He underwent surgery.
emphasise|подчёркивать|She emphasised the main point.
acknowledge|признавать|He acknowledged the problem.
anticipate|предвидеть|We didn't anticipate any problems.
contribute|вносить вклад|Everyone contributed to the project.
determine|определять|Genes determine eye colour.
ensure|обеспечивать, гарантировать|Please ensure the door is locked.
maintain|поддерживать; утверждать|Maintain a healthy weight.
overcome|преодолевать|She overcame her fear.
pursue|стремиться к, заниматься|He pursued a career in law.
hesitate|колебаться|Don't hesitate to call me.
struggle|бороться, с трудом справляться|I struggle with grammar.
tend to|иметь склонность|I tend to sleep late.
rely on|полагаться на|You can rely on me.
cope with|справляться с|How do you cope with stress?
point out|указывать (на что-то)|He pointed out my mistake.
bring up|поднимать (тему); воспитывать|Don't bring up politics.
come across|наткнуться на|I came across an old photo.
look into|изучать, расследовать|We'll look into it.
take over|взять на себя; захватить|She took over the company.
break down|ломаться; не выдержать|My car broke down.
go through|переживать, проходить через|He went through a hard time.
end up|в итоге оказаться|We ended up staying home.
stand out|выделяться|Her work stands out.
hold on|подождать; держаться|Hold on a second.
make up one's mind|решиться|I can't make up my mind.
take into account|принимать во внимание|Take the weather into account.
to some extent|в некоторой степени|I agree to some extent.
in terms of|с точки зрения|In terms of price, it's great.
as a result|в результате|As a result, we lost.
on the other hand|с другой стороны|On the other hand, it's expensive.
nevertheless|тем не менее|It was hard; nevertheless, we won.
whereas|тогда как|I like tea, whereas she likes coffee.
despite|несмотря на|Despite the rain, we went out.
furthermore|более того|Furthermore, it's cheap.
apparently|по-видимому|Apparently, he's moving.
gradually|постепенно|Things gradually improved.
significantly|значительно|Prices rose significantly.
approach|подход; приближаться|We need a new approach.
consequence|последствие|Think about the consequences.
issue|вопрос, проблема|This is a serious issue.
evidence|доказательство|There is no evidence.
impact|влияние|Social media has a big impact.
outcome|результат, исход|The outcome was positive.
priority|приоритет|Safety is our priority.
requirement|требование|What are the requirements?
feature|особенность, функция|This phone has great features.
trend|тенденция|It's a new trend.
threat|угроза|Climate change is a threat.
burden|бремя, обуза|I don't want to be a burden.
insight|понимание, проницательность|The book gives insight into history.
awareness|осведомлённость|We need to raise awareness.
reluctant|неохотный|He was reluctant to help.
eager|стремящийся, жаждущий|She is eager to learn.
crucial|решающий, ключевой|It's a crucial moment.
relevant|актуальный, уместный|This is not relevant.
reasonable|разумный|The price is reasonable.
sufficient|достаточный|We have sufficient time.
vague|расплывчатый|His answer was vague.
genuine|подлинный, искренний|She showed genuine interest.
straightforward|простой, понятный|The task is straightforward.
inevitable|неизбежный|Change is inevitable.
thorough|тщательный|We did a thorough check.
deliberate|намеренный|It was a deliberate choice.
tremendous|огромный|He made tremendous progress.
subtle|тонкий, едва уловимый|There's a subtle difference.
versatile|разносторонний|She is a versatile actress.
overwhelmed|ошеломлённый, перегруженный|I feel overwhelmed at work.
exhausted|измотанный|I'm absolutely exhausted.
thrilled|в восторге|I'm thrilled with the news.
frustrated|раздосадованный|He felt frustrated.
upset|расстроенный|She was upset about it.
convenient|удобный|Is Monday convenient for you?
efficient|эффективный|It's an efficient system.
affordable|доступный по цене|We need affordable housing.
accurate|точный|The data is accurate.
`
};

// Неправильные глаголы: "V1|V2|V3|перевод". Варианты через "/".
DATA.verbs = `
be|was/were|been|быть
become|became|become|становиться
begin|began|begun|начинать
break|broke|broken|ломать
bring|brought|brought|приносить
build|built|built|строить
buy|bought|bought|покупать
catch|caught|caught|ловить
choose|chose|chosen|выбирать
come|came|come|приходить
cost|cost|cost|стоить
cut|cut|cut|резать
do|did|done|делать
draw|drew|drawn|рисовать
drink|drank|drunk|пить
drive|drove|driven|водить машину
eat|ate|eaten|есть
fall|fell|fallen|падать
feel|felt|felt|чувствовать
fight|fought|fought|драться
find|found|found|находить
fly|flew|flown|летать
forget|forgot|forgotten|забывать
forgive|forgave|forgiven|прощать
get|got|got/gotten|получать
give|gave|given|давать
go|went|gone|идти
grow|grew|grown|расти
have|had|had|иметь
hear|heard|heard|слышать
hide|hid|hidden|прятать
hit|hit|hit|ударять
hold|held|held|держать
hurt|hurt|hurt|ранить; болеть
keep|kept|kept|хранить, держать
know|knew|known|знать
lead|led|led|вести
learn|learnt/learned|learnt/learned|учить
leave|left|left|покидать
lend|lent|lent|одалживать
let|let|let|позволять
lose|lost|lost|терять
make|made|made|делать, создавать
mean|meant|meant|значить
meet|met|met|встречать
pay|paid|paid|платить
put|put|put|класть
read|read|read|читать
ride|rode|ridden|ездить верхом
ring|rang|rung|звонить
rise|rose|risen|подниматься
run|ran|run|бежать
say|said|said|сказать
see|saw|seen|видеть
sell|sold|sold|продавать
send|sent|sent|отправлять
set|set|set|устанавливать
shake|shook|shaken|трясти
shine|shone|shone|сиять
shoot|shot|shot|стрелять
show|showed|shown|показывать
shut|shut|shut|закрывать
sing|sang|sung|петь
sit|sat|sat|сидеть
sleep|slept|slept|спать
speak|spoke|spoken|говорить
spend|spent|spent|тратить
stand|stood|stood|стоять
steal|stole|stolen|красть
swim|swam|swum|плавать
take|took|taken|брать
teach|taught|taught|обучать
tear|tore|torn|рвать
tell|told|told|рассказывать
think|thought|thought|думать
throw|threw|thrown|бросать
understand|understood|understood|понимать
wake|woke|woken|просыпаться
wear|wore|worn|носить (одежду)
win|won|won|побеждать
write|wrote|written|писать
`;

// Грамматика: вопрос = [предложение с ___, варианты, индекс верного, объяснение]
DATA.grammar = [
{ id: 'pres', title: 'Present Simple vs Continuous', lv: 'A1–A2',
  tip: '<b>Present Simple</b> — привычки, факты, расписание: <i>I work, she works.</i><br><b>Present Continuous</b> — то, что происходит сейчас или временно: <i>I am working.</i><br>Глаголы состояния (like, know, want, believe) обычно не ставятся в Continuous.',
  qs: [
  ['She ___ to work every day.', ['go', 'goes', 'is going', 'going'], 1, 'Регулярное действие (every day) → Present Simple. С he/she/it добавляем -s.'],
  ['Look! It ___ .', ['rains', 'is raining', 'rain', 'rained'], 1, 'Look! — действие происходит прямо сейчас → Present Continuous.'],
  ['I ___ coffee. I prefer tea.', ["don't like", "am not liking", "doesn't like", 'not like'], 0, 'Like — глагол состояния, в Continuous не используется. С I — don\'t.'],
  ['What ___ you usually do at weekends?', ['are', 'do', 'does', 'is'], 1, 'Привычка (usually) → Present Simple, вопрос с you через do.'],
  ['We ___ on a new project this month.', ['work', 'are working', 'works', 'worked'], 1, 'Временный процесс в текущий период (this month) → Present Continuous.'],
  ['Water ___ at 100 degrees.', ['boil', 'is boiling', 'boils', 'boiling'], 2, 'Общеизвестный факт → Present Simple.']
]},
{ id: 'past', title: 'Past Simple vs Present Perfect', lv: 'A2–B1',
  tip: '<b>Past Simple</b> — законченное действие с указанием времени: <i>yesterday, last year, in 2010</i>.<br><b>Present Perfect</b> (have/has + V3) — опыт (<i>ever, never</i>), результат к настоящему моменту, период до сейчас (<i>since, for, already, yet</i>).',
  qs: [
  ['I ___ him yesterday.', ['have seen', 'saw', 'see', 'had seen'], 1, 'Yesterday — конкретное время в прошлом → Past Simple.'],
  ['I ___ never ___ to Japan.', ['have / been', 'did / go', 'was / be', 'have / went'], 0, 'Опыт за всю жизнь (never) → Present Perfect: have + V3 (been).'],
  ['She ___ here since 2020.', ['lives', 'lived', 'has lived', 'is living'], 2, 'Since + момент в прошлом, действие продолжается до сих пор → Present Perfect.'],
  ['___ you ever ___ sushi?', ['Did / eat', 'Have / eaten', 'Do / eat', 'Were / eating'], 1, 'Ever — вопрос об опыте → Present Perfect.'],
  ['We ___ the film last night.', ['have watched', 'watched', 'watch', 'were watch'], 1, 'Last night — завершённое время → Past Simple.'],
  ['Oh no! I ___ my keys.', ['lost', 'have lost', 'lose', 'was losing'], 1, 'Важен результат сейчас (ключей нет) → Present Perfect.']
]},
{ id: 'art', title: 'Артикли a / an / the', lv: 'A1–B1',
  tip: '<b>a/an</b> — один из многих, упоминаем впервые (<i>an</i> — перед гласным <u>звуком</u>).<br><b>the</b> — конкретный, известный обоим или единственный (<i>the sun</i>).<br><b>Без артикля</b> — абстрактное и неисчисляемое в общем смысле, а также <i>by bus, at home</i>.',
  qs: [
  ['I saw ___ elephant at the zoo.', ['a', 'an', 'the', '—'], 1, 'Перед гласным звуком — an.'],
  ['___ sun is very bright today.', ['A', 'An', 'The', '—'], 2, 'Единственный в своём роде предмет → the.'],
  ['She is ___ doctor.', ['a', 'an', 'the', '—'], 0, 'Профессия (одна из многих) → a.'],
  ['I love ___ music.', ['a', 'the', '—', 'an'], 2, 'Абстрактное понятие в общем смысле — без артикля.'],
  ['Can you close ___ door, please?', ['a', 'an', 'the', '—'], 2, 'Обоим понятно, о какой двери речь → the.'],
  ['He goes to work by ___ bus.', ['a', 'the', '—', 'an'], 2, 'by + транспорт — без артикля.'],
  ["It's ___ university in London.", ['a', 'an', 'the', '—'], 0, 'University начинается с согласного звука [ju:] → a.']
]},
{ id: 'prep', title: 'Предлоги in / on / at', lv: 'A1–A2',
  tip: '<b>in</b> — месяцы, годы, сезоны, города, страны, «внутри».<br><b>on</b> — дни недели, даты, поверхность.<br><b>at</b> — точное время, точка/место (<i>at 5 pm, at the station</i>).',
  qs: [
  ['My birthday is ___ May.', ['in', 'on', 'at', 'by'], 0, 'Месяцы, годы, сезоны → in.'],
  ['The meeting is ___ Monday.', ['in', 'on', 'at', 'to'], 1, 'Дни недели и даты → on.'],
  ["I'll call you ___ 6 o'clock.", ['in', 'on', 'at', 'for'], 2, 'Точное время → at.'],
  ['She lives ___ Paris.', ['at', 'in', 'on', 'to'], 1, 'Города и страны → in.'],
  ['The picture is ___ the wall.', ['in', 'at', 'on', 'over'], 2, 'На поверхности → on.'],
  ["I'm waiting ___ the bus stop.", ['in', 'on', 'at', 'to'], 2, 'Точка (остановка, станция) → at.'],
  ['I was born ___ 1995.', ['on', 'at', 'in', 'by'], 2, 'Год → in.']
]},
{ id: 'fut', title: 'Будущее: will / going to', lv: 'A2–B1',
  tip: '<b>will</b> — спонтанное решение, обещание, мнение (<i>I think...</i>).<br><b>be going to</b> — план или видимые признаки.<br><b>Present Continuous</b> — договорённость. <b>Present Simple</b> — расписание.',
  qs: [
  ['Look at those clouds! It ___ rain.', ['will', 'is going to', 'rains', 'is raining'], 1, 'Есть видимые признаки → be going to.'],
  ["— I'm cold. — I ___ close the window.", ['am going to', 'will', 'close', 'am closing'], 1, 'Спонтанное решение в момент речи → will.'],
  ["I ___ my grandma tomorrow. I've already bought the tickets.", ['will visit', 'am visiting', 'visit', 'visited'], 1, 'Договорённость, всё уже организовано → Present Continuous.'],
  ['The train ___ at 7:15 tomorrow.', ['leaves', 'will leaving', 'is leave', 'leave'], 0, 'Расписание → Present Simple.'],
  ['I think she ___ the exam.', ['passes', 'will pass', 'is passing', 'pass'], 1, 'Мнение/прогноз с I think → will.']
]},
{ id: 'cond', title: 'Условные предложения', lv: 'B1–B2',
  tip: '<b>Zero:</b> If + Present, Present — факты.<br><b>First:</b> If + Present, will — реальное будущее.<br><b>Second:</b> If + Past, would — нереальное сейчас.<br><b>Third:</b> If + Past Perfect, would have + V3 — нереальное прошлое.<br>В части с <i>if</i> will не ставится!',
  qs: [
  ['If it rains, we ___ at home.', ['stay', 'will stay', 'would stay', 'stayed'], 1, 'First Conditional: If + Present, will + V.'],
  ['If I ___ rich, I would travel the world.', ['am', 'were', 'will be', 'have been'], 1, 'Second Conditional: If + Past Simple. С I в таких предложениях часто were.'],
  ['If you heat ice, it ___ .', ['melts', 'will melt', 'would melt', 'melted'], 0, 'Zero Conditional — общая истина: If + Present, Present.'],
  ['If I had known, I ___ you.', ['would tell', 'will tell', 'would have told', 'told'], 2, 'Third Conditional: If + Past Perfect, would have + V3.'],
  ['I ___ that if I were you.', ["won't do", "wouldn't do", "don't do", "didn't do"], 1, 'If I were you — совет, Second Conditional → would.'],
  ['Unless you hurry, you ___ the bus.', ['miss', 'will miss', 'would miss', 'missed'], 1, 'Unless = if not; First Conditional → will.']
]},
{ id: 'modal', title: 'Модальные глаголы', lv: 'A2–B1',
  tip: '<b>must</b> — сильная необходимость, уверенный вывод; <b>mustn\'t</b> — запрет;<br><b>don\'t have to</b> — нет необходимости; <b>should</b> — совет;<br><b>can / may</b> — возможность и разрешение. После модальных — глагол без <i>to</i>.',
  qs: [
  ["You ___ smoke here. It's forbidden.", ["mustn't", "don't have to", "needn't", 'may'], 0, "Запрет → mustn't."],
  ["You ___ come if you don't want to.", ["mustn't", "don't have to", "can't", "shouldn't"], 1, "Нет необходимости → don't have to."],
  ['You look tired. You ___ go to bed.', ['should', 'must to', 'can', 'would'], 0, 'Совет → should (без to).'],
  ['___ I open the window?', ['Must', 'May', 'Should to', 'Need'], 1, 'Вежливая просьба о разрешении → May I / Can I.'],
  ['He ___ be at home – the lights are on.', ["can't", 'must', 'should', "mustn't"], 1, 'Уверенный логический вывод → must.']
]},
{ id: 'comp', title: 'Степени сравнения', lv: 'A1–A2',
  tip: 'Короткие: <b>-er / the -est</b> (tall → taller → the tallest).<br>Длинные: <b>more / the most</b>.<br>Исключения: good – better – best, bad – worse – worst.<br>Равенство: <b>as ... as</b>.',
  qs: [
  ['This book is ___ than that one.', ['interesting', 'more interesting', 'most interesting', 'interestinger'], 1, 'Длинное прилагательное → more + прилагательное + than.'],
  ['He is the ___ student in the class.', ['tall', 'taller', 'tallest', 'most tall'], 2, 'Превосходная степень: the + -est.'],
  ['My car is ___ than yours.', ['good', 'better', 'best', 'more good'], 1, 'Good → better → the best (исключение).'],
  ['Today is ___ day of the year.', ['the hottest', 'the hotest', 'hotter', 'the most hot'], 0, 'hot → hotter → the hottest (согласная удваивается).'],
  ["She isn't as tall ___ her sister.", ['than', 'as', 'like', 'that'], 1, 'as ... as — такой же, как.']
]},
{ id: 'pass', title: 'Пассивный залог', lv: 'B1',
  tip: '<b>be + V3.</b> Используем, когда важно действие, а не исполнитель: <i>The house was built in 1900.</i><br>Время показывает глагол be: is done, was done, will be done, has been done, is being done.',
  qs: [
  ['This house ___ in 1900.', ['built', 'was built', 'is building', 'has build'], 1, 'Пассив в прошлом: was/were + V3.'],
  ['English ___ all over the world.', ['speaks', 'is spoken', 'is speaking', 'spoke'], 1, 'Пассив в настоящем: is/are + V3.'],
  ['The letter ___ tomorrow.', ['will send', 'will be sent', 'is sent', 'sends'], 1, 'Пассив в будущем: will be + V3.'],
  ["My phone ___ ! I can't find it.", ['has been stolen', 'has stolen', 'was stealing', 'stole'], 0, 'Present Perfect Passive: has been + V3.'],
  ['The room ___ right now.', ['is cleaning', 'is being cleaned', 'cleans', 'is cleaned'], 1, 'Present Continuous Passive: is being + V3.']
]},
{ id: 'ger', title: 'Герундий или инфинитив', lv: 'B1',
  tip: '<b>-ing</b> после enjoy, mind, avoid, finish, look forward to и после предлогов.<br><b>to + V</b> после want, decide, hope, plan, agree, refuse.<br>Некоторые глаголы меняют смысл: <i>stop doing</i> (бросить) / <i>stop to do</i> (остановиться, чтобы).',
  qs: [
  ['I enjoy ___ books.', ['to read', 'reading', 'read', 'to reading'], 1, 'После enjoy → -ing.'],
  ['She decided ___ a new job.', ['finding', 'to find', 'find', 'found'], 1, 'После decide → to + V.'],
  ['Do you mind ___ the window?', ['to open', 'opening', 'open', 'opened'], 1, 'После mind → -ing.'],
  ["I'm looking forward to ___ you.", ['see', 'seeing', 'to see', 'saw'], 1, 'Здесь to — предлог, после него → -ing.'],
  ["He stopped ___ . He doesn't smoke anymore.", ['to smoke', 'smoking', 'smoke', 'smoked'], 1, 'stop + -ing = прекратить делать.'],
  ['I want ___ English fluently.', ['speaking', 'to speak', 'speak', 'spoke'], 1, 'После want → to + V.']
]},
{ id: 'rep', title: 'Косвенная речь', lv: 'B1–B2',
  tip: 'После <i>said / told</i> время сдвигается назад: am → was, will → would, Past → Past Perfect.<br>В косвенных вопросах — прямой порядок слов: <i>She asked where I lived.</i><br>Просьбы и приказы: <i>told me (not) to do</i>.',
  qs: [
  ['He said, "I am tired." → He said that he ___ tired.', ['is', 'was', 'has been', 'be'], 1, 'Время сдвигается назад: am → was.'],
  ['She asked me where I ___ .', ['live', 'lived', 'do live', 'did I live'], 1, 'Косвенный вопрос: прямой порядок слов и сдвиг времени.'],
  ['"I will help you." → He said he ___ help me.', ['will', 'would', 'can', 'shall'], 1, 'will → would.'],
  ['She told me ___ late.', ['not to be', "don't be", 'not be', 'to not being'], 0, 'Косвенный приказ: told + (not) to + V.']
]},
{ id: 'pcont', title: 'Past Continuous и Past Perfect', lv: 'B1',
  tip: '<b>Past Continuous</b> (was/were + -ing) — процесс в момент прошлого или прерванное действие.<br><b>Past Perfect</b> (had + V3) — то, что случилось раньше другого события в прошлом.',
  qs: [
  ['I ___ TV when you called.', ['watched', 'was watching', 'have watched', 'am watching'], 1, 'Длительное действие прервано другим → Past Continuous.'],
  ['When I arrived, the film ___ already ___ .', ['has / started', 'had / started', 'was / starting', 'did / start'], 1, 'Действие раньше другого в прошлом → Past Perfect.'],
  ['What ___ you doing at 8 pm yesterday?', ['did', 'were', 'was', 'have'], 1, 'Процесс в конкретный момент прошлого → Past Continuous (were + -ing).'],
  ['She was tired because she ___ all day.', ['worked', 'had been working', 'has worked', 'works'], 1, 'Длительное действие до момента в прошлом → Past Perfect Continuous.'],
  ['While I ___ , I cut my finger.', ['cooked', 'was cooking', 'have cooked', 'cook'], 1, 'While + процесс → Past Continuous.']
]},
{ id: 'quant', title: 'some / any, much / many', lv: 'A1–A2',
  tip: '<b>much</b> — с неисчисляемыми, <b>many</b> — с исчисляемыми, <b>a lot of</b> — с любыми.<br><b>some</b> — в утверждениях и просьбах, <b>any</b> — в вопросах и отрицаниях.<br><b>few / little</b> — мало; <b>a few / a little</b> — немного (позитивно).',
  qs: [
  ['Is there ___ milk in the fridge?', ['some', 'any', 'many', 'a'], 1, 'В общих вопросах обычно any.'],
  ['How ___ money do you have?', ['many', 'much', 'lot', 'few'], 1, 'Money — неисчисляемое → much.'],
  ['There are ___ people here.', ['much', 'a lot of', 'a little', 'any'], 1, 'a lot of подходит к исчисляемым во множественном числе.'],
  ['I have ___ friends in this city, so I feel lonely.', ['few', 'a few', 'little', 'much'], 0, 'few = мало (с негативным оттенком); friends — исчисляемое.'],
  ['Would you like ___ tea?', ['any', 'some', 'many', 'few'], 1, 'В предложениях и просьбах — some.']
]}
];
