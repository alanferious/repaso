// Vocabulary for IB Spanish ab initio, organised by the five prescribed themes
// and their twenty prescribed topics, plus a set of core lists.
//
// Line format:   spanish | english
//   ;      separates alternative answers        el coche; el carro | car
//   o/a    masculine/feminine forms             alto/a  -> alto, alta
//   el/la  either article                       el/la profesor/a -> el profesor, la profesora
//   ( )    optional part of an answer           el (teléfono) móvil
//   [ ]    hint only, never needs typing        tarde | late [not early]

// Each theme is a metro line: `line` is its code, `color` its line ink, `on` the text colour on that ink.
const THEMES = [
  { id: "identities", name: "Identities", es: "Identidades", line: "L1", color: "var(--l1)", on: "#fff" },
  { id: "experiences", name: "Experiences", es: "Experiencias", line: "L2", color: "var(--l2)", on: "#0B1230" },
  { id: "ingenuity", name: "Human ingenuity", es: "Ingenio humano", line: "L3", color: "var(--l3)", on: "#fff" },
  { id: "social", name: "Social organization", es: "Organización social", line: "L4", color: "var(--l4)", on: "#fff" },
  { id: "planet", name: "Sharing the planet", es: "Compartir el planeta", line: "L5", color: "var(--l5)", on: "#0B1230" },
  { id: "core", name: "Core essentials", es: "Lo esencial", line: "C", color: "var(--lc)", on: "#0B1230" },
];

const TOPICS = [];
function topic(theme, id, name, es, words) {
  TOPICS.push({ theme, id, name, es, raw: words });
}

/* ───────────────────────────── IDENTITIES ───────────────────────────── */

topic("identities", "attributes", "Personal attributes", "Atributos personales", `
me llamo | my name is; I am called
el nombre | name; first name
el apellido | surname; last name
la edad | age
¿cuántos años tienes? | how old are you?
tengo dieciséis años | I am sixteen years old; I am sixteen; I am 16
nacer | to be born
nací en | I was born in
la nacionalidad | nationality
ser de | to be from
español/a | Spanish
inglés; inglesa | English
francés; francesa | French
alemán; alemana | German
mexicano/a | Mexican
argentino/a | Argentinian; Argentine
estadounidense; norteamericano/a; americano/a | American [from the USA]
chino/a | Chinese
alto/a | tall
bajo/a | short [height]
delgado/a; flaco/a | thin; slim; skinny
gordo/a | fat
de estatura media; de altura media | of medium height; medium height
guapo/a; lindo/a | good-looking; handsome; pretty
feo/a | ugly
joven | young
mayor; viejo/a | old; older [person]; elderly
el pelo; el cabello | hair
los ojos | eyes
el pelo rubio | blond hair; blonde hair
el pelo castaño; el pelo marrón | brown hair
el pelo negro | black hair
el pelo rizado | curly hair
el pelo liso; el pelo lacio | straight hair
el pelo largo | long hair
el pelo corto | short hair
pelirrojo/a | red-haired; ginger
los ojos azules | blue eyes
los ojos verdes | green eyes
los ojos marrones; los ojos cafés | brown eyes
llevar gafas; llevar lentes; usar gafas | to wear glasses
la barba | beard
la personalidad | personality
simpático/a; agradable; majo/a | nice; friendly; likeable
antipático/a | unfriendly; unpleasant; mean
amable | kind; nice
trabajador/a | hard-working
perezoso/a; vago/a | lazy
inteligente; listo/a | intelligent; clever; smart; bright
tímido/a | shy; timid
extrovertido/a; sociable | outgoing; extroverted; sociable
hablador/a | talkative; chatty
gracioso/a; chistoso/a | funny
serio/a | serious
generoso/a | generous
egoísta | selfish
paciente | patient
impaciente | impatient
responsable | responsible
educado/a; cortés | polite; well-mannered
maleducado/a; grosero/a | rude; bad-mannered; impolite
tranquilo/a; calmado/a | calm; quiet; relaxed
alegre; feliz; contento/a | cheerful; happy
creativo/a | creative
`);

topic("identities", "relationships", "Personal relationships", "Relaciones personales", `
la familia | family
los padres | parents
la madre; la mamá | mother; mum; mom
el padre; el papá | father; dad
el hermano | brother
la hermana | sister
los hermanos | siblings; brothers and sisters; brothers
el hijo | son
la hija | daughter
los hijos | children [sons and daughters]
hijo único; hija única | only child
el abuelo | grandfather
la abuela | grandmother
los abuelos | grandparents
el tío | uncle
la tía | aunt
el/la primo/a | cousin
el sobrino | nephew
la sobrina | niece
el marido; el esposo | husband
la mujer; la esposa | wife
el padrastro | stepfather
la madrastra | stepmother
el/la gemelo/a | twin
el bebé | baby
el/la adolescente | teenager; adolescent
la gente; las personas | people
mayor que | older than
menor que | younger than
el/la amigo/a | friend
el mejor amigo; la mejor amiga | best friend
el novio | boyfriend
la novia | girlfriend
la pareja | couple; partner
el/la compañero/a | classmate; companion; partner
el/la vecino/a | neighbour; neighbor
la mascota | pet
el perro | dog
el gato | cat
la relación | relationship
la amistad | friendship
el amor | love
la confianza | trust
el apoyo | support
el respeto | respect
conocer | to meet; to know [a person]; to get to know
llevarse bien con | to get on well with; to get along with
llevarse mal con | to get on badly with; to not get on with
pelearse | to fight; to fall out; to quarrel
discutir | to argue
confiar en | to trust
apoyar | to support
salir con | to go out with; to date
enamorarse de | to fall in love with
casarse | to get married; to marry
estar casado/a | to be married
divorciarse | to get divorced
estar separado/a | to be separated
la boda | wedding
`);

topic("identities", "food", "Eating and drinking", "Comer y beber", `
la comida | food; meal; lunch
el desayuno | breakfast
el almuerzo | lunch
la cena | dinner; supper
la merienda | afternoon snack; snack
desayunar | to have breakfast
almorzar; comer | to have lunch
cenar | to have dinner
tener hambre | to be hungry
tener sed | to be thirsty
el pan | bread
la leche | milk
el agua | water
el zumo; el jugo | juice
el café | coffee
el té | tea
el refresco; la gaseosa | soft drink; fizzy drink; soda
el queso | cheese
el huevo | egg
la carne | meat
el pollo | chicken
el pescado | fish [food]
el jamón | ham
el arroz | rice
la pasta | pasta
las patatas; las papas | potatoes
las patatas fritas; las papas fritas | chips; fries; crisps
las verduras; los vegetales; las hortalizas | vegetables
la fruta | fruit
la manzana | apple
la naranja | orange
el plátano; la banana; el banano | banana
la fresa | strawberry
el tomate | tomato
la lechuga | lettuce
la ensalada | salad
la sopa | soup
el bocadillo; el sándwich; el sandwich | sandwich [in a baguette]; sandwich
los dulces; los caramelos; las golosinas | sweets; candy
el pastel; la tarta | cake; pastry
el helado | ice cream
el postre | dessert
el azúcar | sugar
la sal | salt
el aceite | oil
picante | spicy; hot [spicy]
rico/a; delicioso/a; sabroso/a | delicious; tasty; yummy
sano/a; saludable | healthy
la comida rápida | fast food
la comida basura | junk food
vegetariano/a | vegetarian
vegano/a | vegan
alérgico/a a | allergic to
la dieta | diet
el restaurante | restaurant
el/la camarero/a; el/la mesero/a | waiter; waitress; server
la cuenta | bill; check
el menú del día | set menu; menu of the day
pedir | to order; to ask for
¿qué vas a tomar? | what are you going to have?
de primero | as a starter; for the first course
de postre | for dessert
el plato | dish; plate
la receta | recipe
cocinar | to cook
probar | to try; to taste
`);

topic("identities", "wellbeing", "Physical wellbeing", "Bienestar físico", `
la salud | health
el cuerpo | body
la cabeza | head
el brazo | arm
la mano | hand
la pierna | leg
el pie | foot
la espalda | back
el estómago; la barriga; la tripa | stomach; tummy; belly
la garganta | throat
los dientes | teeth
el corazón | heart
la nariz | nose
la boca | mouth
las orejas; los oídos | ears
el dolor | pain
me duele la cabeza | I have a headache; my head hurts
me duelen los pies | my feet hurt
me rompí la pierna | I broke my leg
estar enfermo/a | to be ill; to be sick
estar cansado/a | to be tired
estar resfriado/a; tener un resfriado; estar constipado/a | to have a cold
tener fiebre | to have a temperature; to have a fever
tener gripe | to have flu; to have the flu
la tos | cough
herido/a; lastimado/a | injured; hurt
el/la médico/a; el/la doctor/a | doctor
el hospital | hospital
la farmacia | pharmacy; chemist's
la medicina; el medicamento | medicine
la pastilla; la píldora; el comprimido | pill; tablet
la cita | appointment; date
hacer ejercicio | to exercise; to do exercise
estar en forma | to be fit
mantenerse en forma | to keep fit; to stay in shape
el gimnasio | gym
entrenar; entrenarse | to train
dormir bien | to sleep well
el sueño | sleep; dream
descansar | to rest
el estrés | stress
estresado/a | stressed
la salud mental | mental health
la ansiedad | anxiety
fumar | to smoke
el tabaco | tobacco
el alcohol | alcohol
las drogas | drugs
llevar una vida sana; llevar una vida saludable | to lead a healthy life; to have a healthy lifestyle
equilibrado/a | balanced
evitar | to avoid
perder peso; adelgazar | to lose weight
engordar; ganar peso | to put on weight; to gain weight
`);

/* ───────────────────────────── EXPERIENCES ───────────────────────────── */

topic("experiences", "routine", "Daily routine", "La rutina diaria", `
la rutina | routine
despertarse | to wake up
levantarse | to get up
ducharse; darse una ducha | to have a shower; to shower
bañarse; darse un baño | to have a bath
lavarse los dientes; cepillarse los dientes | to brush one's teeth; to brush my teeth; to brush your teeth
vestirse | to get dressed
peinarse | to comb one's hair; to brush one's hair
maquillarse | to put on make-up; to put on makeup
afeitarse | to shave
el despertador | alarm clock
salir de casa | to leave home; to leave the house
ir al instituto; ir al colegio; ir a la escuela; ir al insti | to go to school [secondary]
coger el autobús; tomar el autobús; coger el bus; tomar el bus | to catch the bus; to take the bus
llegar | to arrive
empezar; comenzar | to start; to begin
terminar; acabar | to finish; to end
tardo veinte minutos | it takes me twenty minutes
volver a casa; regresar a casa | to return home; to go back home; to come back home
la hora de comer | lunchtime
hacer los deberes; hacer la tarea; hacer las tareas | to do homework; to do my homework
ver la televisión; ver la tele | to watch TV; to watch television
acostarse | to go to bed
dormirse | to fall asleep
a las siete | at seven o'clock; at seven
en punto | on the dot; o'clock [exactly]
cada mañana | every morning; each morning
el fin de semana | weekend; the weekend
los días laborables | weekdays; working days
el dormitorio; la habitación; el cuarto | bedroom
ayudar en casa | to help at home
las tareas domésticas; las tareas del hogar; los quehaceres | household chores; chores; housework
poner la mesa | to set the table; to lay the table
quitar la mesa | to clear the table
lavar los platos; fregar los platos | to wash the dishes; to do the washing up
hacer la cama | to make the bed
pasar la aspiradora | to vacuum; to hoover
sacar la basura | to take out the rubbish; to take out the trash
ordenar mi dormitorio; ordenar mi habitación; ordenar mi cuarto | to tidy my bedroom; to tidy my room
pasear al perro; sacar al perro | to walk the dog
`);

topic("experiences", "leisure", "Leisure", "El ocio", `
el ocio | leisure
el tiempo libre | free time; spare time
el pasatiempo; el hobby | hobby; pastime
la afición; el hobby | hobby; interest
jugar al fútbol; jugar fútbol | to play football; to play soccer
jugar al baloncesto; jugar al básquetbol; jugar al básquet; jugar baloncesto | to play basketball
jugar al tenis; jugar tenis | to play tennis
jugar a los videojuegos | to play video games
hacer deporte; practicar deporte | to do sport; to play sport; to do sports
nadar | to swim
correr | to run
montar en bicicleta; montar en bici; andar en bicicleta; ir en bici | to ride a bike; to cycle
montar a caballo | to ride a horse; to go horse riding
hacer senderismo | to go hiking; to hike
dar un paseo; pasear; ir de paseo | to go for a walk; to take a walk
ir de compras | to go shopping
ir al cine | to go to the cinema; to go to the movies
salir con amigos | to go out with friends
quedar con amigos | to meet up with friends
tocar la guitarra | to play the guitar
tocar el piano | to play the piano
cantar | to sing
bailar | to dance
leer | to read
dibujar | to draw
pintar | to paint
sacar fotos; tomar fotos; hacer fotos | to take photos; to take pictures
escuchar música | to listen to music
el ajedrez | chess
el equipo | team
el partido | match; game
el club | club
el polideportivo | sports centre; sports center; leisure centre
la piscina; la alberca | swimming pool; pool
el parque | park
el centro comercial | shopping centre; shopping mall; mall
el concierto | concert
el museo | museum
el teatro | theatre; theater; drama
el campo | countryside; field; pitch
ganar | to win; to earn
perder | to lose; to miss
el/la aficionado/a; el/la hincha | fan; supporter
hacer voluntariado; ser voluntario/a | to volunteer; to do volunteering
`);

topic("experiences", "holidays", "Holidays", "Las vacaciones", `
las vacaciones | holidays; vacation
ir de vacaciones | to go on holiday; to go on vacation
el viaje | trip; journey
viajar | to travel
el/la turista | tourist
el turismo | tourism
hacer turismo | to go sightseeing; to sightsee
el destino | destination
la playa | beach
la montaña | mountain; mountains
la ciudad | city; town
el extranjero | abroad
ir al extranjero | to go abroad
el hotel | hotel
el albergue juvenil | youth hostel
el camping | campsite
ir de camping | to go camping
alojarse; hospedarse; quedarse | to stay [accommodation]
quedarse | to stay; to remain
la estancia | stay
la habitación; el cuarto | room; bedroom
la habitación doble | double room
la habitación individual | single room
reservar | to book; to reserve
la reserva | booking; reservation
la maleta | suitcase
hacer la maleta | to pack; to pack my suitcase
el pasaporte | passport
el billete; el boleto | ticket
el aeropuerto | airport
el avión | plane; aeroplane; airplane
tomar el sol; broncearse | to sunbathe
la crema solar; el protector solar | sun cream; sunscreen
quemarse | to get sunburnt; to burn
el mar | sea
bañarse en el mar | to swim in the sea
visitar | to visit
los monumentos | monuments
la excursión | trip; excursion; outing
el recuerdo | souvenir; memory
el mapa | map
la oficina de turismo | tourist office
las vistas; la vista | views; the view; view
el paisaje | landscape; scenery
¿dónde te alojaste? | where did you stay?
lo pasé bomba; lo pasé genial; lo pasé muy bien | I had a great time; I had a fantastic time
lo pasé fatal; lo pasé muy mal | I had an awful time; I had a terrible time
fue inolvidable | it was unforgettable
hacía sol | it was sunny
hacía calor | it was hot
llovió | it rained
`);

topic("experiences", "festivals", "Festivals and celebrations", "Fiestas y celebraciones", `
la fiesta | party; festival; celebration
el festival | festival
celebrar; festejar | to celebrate
la celebración | celebration
el cumpleaños | birthday
la Navidad | Christmas
la Nochebuena | Christmas Eve
la Nochevieja | New Year's Eve
el Año Nuevo | New Year
los Reyes Magos | the Three Kings; the Three Wise Men
el Día de los Muertos | the Day of the Dead
la Semana Santa | Holy Week; Easter
el Carnaval | Carnival
la quinceañera | quinceañera; fifteenth birthday party
el Día de la Madre | Mother's Day
el día festivo; el feriado; el día feriado | public holiday; bank holiday
la tradición | tradition
tradicional | traditional
la costumbre | custom; habit
religioso/a | religious
la iglesia | church
la procesión | procession
el desfile | parade
los fuegos artificiales | fireworks
las uvas | grapes
disfrazarse | to dress up; to wear a costume
el disfraz | costume; fancy dress
el traje típico | traditional costume; traditional dress
la comida típica | typical food; traditional food
el regalo | present; gift
regalar | to give [as a present]; to give a gift
la tarta; el pastel | cake [birthday]; cake
las velas | candles
decorar; adornar | to decorate
la decoración | decoration
invitar | to invite
el/la invitado/a | guest
la invitación | invitation
reunirse | to get together; to meet
la reunión familiar | family gathering
brindar | to toast; to make a toast
¡felicidades!; ¡enhorabuena!; ¡felicitaciones! | congratulations!; happy birthday!
¡feliz cumpleaños! | happy birthday!
¡feliz Navidad! | merry Christmas!; happy Christmas!
¡feliz Año Nuevo! | happy New Year!
`);

/* ─────────────────────────── HUMAN INGENUITY ─────────────────────────── */

topic("ingenuity", "transport", "Transport", "El transporte", `
el transporte | transport; transportation
el transporte público | public transport; public transportation
el coche; el carro; el auto | car; automobile
el autobús; el bus | bus
el autocar | coach
el tren | train
el metro | underground; subway; metro; tube
el avión | plane; aeroplane; airplane
el barco | boat; ship
la bicicleta; la bici | bicycle; bike
la moto; la motocicleta | motorbike; motorcycle
el taxi | taxi
ir a pie; ir andando; caminar | to go on foot; to walk
ir en coche | to go by car
ir en tren | to go by train
la estación | station
la estación de autobuses | bus station
la parada de autobús | bus stop
el andén | platform
el billete de ida; el boleto de ida | one-way ticket; single ticket
el billete de ida y vuelta; el boleto de ida y vuelta | return ticket; round-trip ticket
el horario | timetable; schedule
salir | to leave; to go out; to depart
la salida | departure; exit
la llegada | arrival
el retraso; la demora | delay
el atasco; el embotellamiento | traffic jam
el tráfico | traffic
rápido/a | fast; quick
lento/a | slow
cómodo/a | comfortable
incómodo/a | uncomfortable
barato/a | cheap
caro/a | expensive
conducir; manejar | to drive
el carné de conducir; el carnet de conducir; el permiso de conducir; la licencia de conducir | driving licence; driver's license
la carretera | road
la autopista | motorway; highway
la calle | street
el semáforo | traffic lights
cruzar | to cross
girar; doblar; torcer | to turn
todo recto; todo derecho | straight on; straight ahead
a la derecha | on the right; to the right
a la izquierda | on the left; to the left
cerca de | near; close to
lejos de | far from
el/la pasajero/a | passenger
el carril bici | cycle lane; bike lane
el coche eléctrico | electric car
la gasolina | petrol; gasoline; gas
ecológico/a | eco-friendly; ecological
`);

topic("ingenuity", "entertainment", "Entertainment", "El entretenimiento", `
el entretenimiento | entertainment
la película; el filme | film; movie
la película de acción | action film; action movie
la película de terror | horror film; horror movie
la película de ciencia ficción | science fiction film; sci-fi film
la película romántica | romantic film; romantic movie
la comedia | comedy
los dibujos animados | cartoons
el documental | documentary
la serie | series; TV series
el programa | programme; program; show
el concurso | game show; competition; quiz show
el actor | actor
la actriz | actress
el/la cantante | singer
el grupo; la banda | group; band
la canción | song
el espectáculo | show; performance
la obra de teatro | play
el musical | musical
la entrada; el boleto | ticket [for an event]; entrance
la taquilla | box office; ticket office
el estreno | premiere; release
el argumento; la trama | plot; argument
el personaje | character [in a story]
el/la protagonista | main character; protagonist
los efectos especiales | special effects
la estrella | star
famoso/a; conocido/a | famous; well-known
la fama | fame
el videojuego | video game
el parque de atracciones; el parque de diversiones | theme park; amusement park
el circo | circus
el zoo | zoo
la feria | fair
la discoteca | nightclub; club; disco
la exposición | exhibition
el arte | art
la galería de arte | art gallery
el público | audience; public
aplaudir | to applaud; to clap
reírse | to laugh
llorar | to cry
asustar; dar miedo | to frighten; to scare
me hizo reír | it made me laugh
la reseña; la crítica | review
recomendar | to recommend
entretenido/a | entertaining
`);

topic("ingenuity", "media", "Media", "Los medios", `
los medios de comunicación; los medios | the media; media
la prensa | the press; press
el periódico; el diario | newspaper
la revista | magazine
las noticias | news; the news
las noticias falsas | fake news; false news
el/la periodista | journalist
el artículo | article
el titular | headline
la portada | front page; cover
la radio | radio
la emisora | radio station
la televisión; la tele | television; TV
el canal | channel
el/la presentador/a | presenter; host
en directo | live
el anuncio; el comercial | advert; advertisement; ad; commercial
la publicidad | advertising
las redes sociales | social media; social networks
el blog | blog
el/la bloguero/a | blogger
el/la seguidor/a | follower
seguir | to follow
publicar; colgar | to publish; to post
compartir | to share
comentar | to comment
el comentario | comment
el vídeo; el video | video
la foto | photo
subir | to upload; to go up
descargar; bajar | to download
el mensaje | message
el pódcast; el podcast | podcast
informar | to inform; to report
la información | information
la entrevista | interview
entrevistar | to interview
el reportaje | report; feature
la libertad de expresión | freedom of speech; freedom of expression
la opinión | opinion
la fuente | source; fountain
fiable; confiable | reliable; trustworthy
la privacidad | privacy
el ciberacoso | cyberbullying
la audiencia | audience; ratings
`);

topic("ingenuity", "technology", "Technology", "La tecnología", `
la tecnología | technology
el ordenador; la computadora; el computador | computer
el portátil; el ordenador portátil; la laptop | laptop
el (teléfono) móvil; el celular | mobile phone; cell phone; mobile
la tableta | tablet
la pantalla | screen
el teclado | keyboard
el ratón | mouse
la impresora | printer
los auriculares; los cascos; los audífonos | headphones; earphones
el cargador | charger
la batería | battery
el dispositivo | device
la cámara | camera
internet; el internet | internet; the internet
la red | network; net
el wifi | wifi; wi-fi
la página web | web page; website
el sitio web | website
la aplicación; la app | app; application
el correo electrónico; el email; el e-mail; el correo | email; e-mail
la contraseña; la clave | password
el usuario | user; username
navegar por internet | to surf the internet; to browse the internet
buscar | to look for; to search
enviar; mandar | to send
recibir | to receive
guardar | to save; to keep
borrar; eliminar | to delete; to erase
imprimir | to print
cargar | to charge; to load
encender; prender | to turn on; to switch on
apagar | to turn off; to switch off
funcionar | to work [machine]; to function
el robot | robot
la inteligencia artificial | artificial intelligence; AI
la realidad virtual | virtual reality; VR
el invento | invention
inventar | to invent
el/la inventor/a | inventor
avanzado/a | advanced
la ventaja | advantage
la desventaja | disadvantage
el riesgo | risk
peligroso/a | dangerous
la seguridad | safety; security
enganchado/a | hooked; addicted
la adicción | addiction
depender de | to depend on
desconectar | to disconnect; to switch off
`);

/* ───────────────────────── SOCIAL ORGANIZATION ───────────────────────── */

topic("social", "neighbourhood", "Neighbourhood", "El barrio", `
el barrio | neighbourhood; neighborhood; area
la ciudad | city; town
el pueblo | town; village
la capital | capital
el centro | centre; center; city centre; town centre
las afueras | outskirts; suburbs
vivir | to live
la casa; el hogar | house; home
el piso; el apartamento; el departamento | flat; apartment; floor
el jardín | garden
el edificio | building
el rascacielos | skyscraper
la plaza | square
la calle | street
el parque | park
el supermercado | supermarket
la tienda | shop; store
el mercado | market
la panadería | bakery
la carnicería | butcher's
la librería | bookshop; bookstore
la biblioteca | library
el banco | bank; bench
la oficina de correos; correos | post office
el ayuntamiento | town hall; city hall
la comisaría | police station
el estadio | stadium
el puente | bridge
el río | river
las instalaciones | facilities
la zona peatonal | pedestrian area; pedestrian zone
las zonas verdes | green spaces; green areas
el ruido | noise
ruidoso/a | noisy
animado/a | lively
sucio/a | dirty
limpio/a | clean
seguro/a | safe; sure
moderno/a | modern
antiguo/a; viejo/a | old; ancient
rural | rural
urbano/a | urban
hay | there is; there are
no hay | there isn't; there aren't; there is no; there are no
al lado de; junto a | next to; beside
enfrente de; frente a | opposite
delante de | in front of
detrás de | behind
entre | between; among
`);

topic("social", "education", "Education", "La educación", `
el colegio; la escuela | school
el instituto | secondary school; high school
la escuela; el colegio | school; primary school
la universidad | university; college
el/la alumno/a | pupil; student
el/la estudiante | student
el/la profesor/a; el/la maestro/a | teacher
el/la director/a | headteacher; principal; head
la clase | class; classroom; lesson
el aula | classroom
la asignatura; la materia | subject
el horario | timetable; schedule
el recreo | break; recess
el examen | exam
aprobar | to pass [an exam]
suspender; reprobar | to fail [an exam]
sacar buenas notas; sacar buenas calificaciones | to get good grades; to get good marks
la nota | mark; grade; note
los deberes; la tarea; las tareas | homework
estudiar | to study
aprender | to learn
enseñar | to teach; to show
repasar | to revise; to review
explicar | to explain
contestar; responder | to answer
hacer preguntas | to ask questions
entender; comprender | to understand
el uniforme | uniform
llevar uniforme | to wear a uniform
las normas; las reglas | rules
obligatorio/a | compulsory; obligatory; mandatory
prohibido/a | forbidden; banned; prohibited
las matemáticas; las mates | maths; mathematics; math
las ciencias | science; sciences
la biología | biology
la química | chemistry
la física | physics
la historia | history; story
la geografía | geography
el inglés | English [subject]
el español | Spanish [subject]
los idiomas | languages
la educación física | PE; physical education
la informática; la computación | computing; IT; ICT; computer science
la filosofía | philosophy
la economía | economics; economy
el Bachillerato Internacional | International Baccalaureate; IB
el laboratorio | laboratory; lab
el comedor; la cafetería; la cantina | canteen; dining hall; cafeteria
el estuche | pencil case
el bolígrafo; el boli; la pluma | pen
el lápiz | pencil
el cuaderno; la libreta | exercise book; notebook
la mochila | school bag; backpack; rucksack
las actividades extraescolares | extracurricular activities; after-school activities
el intercambio | exchange
la beca | scholarship; grant
el curso | school year; year [school]; course
la carrera | degree; career; race
la formación profesional | vocational training
el acoso escolar | bullying; school bullying
faltar a clase | to miss class; to skip class
el éxito | success
la presión | pressure
`);

topic("social", "workplace", "The workplace", "El mundo laboral", `
el trabajo | work; job
trabajar | to work
el empleo | job; employment
el paro; el desempleo | unemployment
estar en paro | to be unemployed
buscar trabajo | to look for work; to look for a job
el trabajo a tiempo parcial | part-time job; part-time work
el trabajo a tiempo completo | full-time job; full-time work
las prácticas | work experience; internship
el sueldo; el salario | salary; wage; pay
ganar dinero | to earn money
el dinero | money
la empresa; la compañía | company; firm; business
la oficina | office
la fábrica | factory
el jefe; la jefa | boss
el/la empleado/a | employee
el/la compañero/a de trabajo | colleague; co-worker
el/la cliente | customer; client
la entrevista de trabajo | job interview
el currículum; el currículo; el currículum vitae; el CV | CV; résumé; resume
la carta de presentación | cover letter; covering letter
solicitar | to apply for
la solicitud | application
la experiencia | experience
las habilidades; las destrezas | skills
la reunión | meeting
el contrato | contract
contratar | to hire; to employ
despedir | to fire; to dismiss; to sack
bien pagado/a | well paid; well-paid
mal pagado/a | badly paid; poorly paid
exigente | demanding
agotador/a | exhausting; tiring
gratificante | rewarding
el ambiente de trabajo | working environment; work atmosphere
jubilarse; retirarse | to retire
cuidar niños; hacer de canguro | to babysit; to look after children
repartir periódicos | to deliver newspapers
el/la enfermero/a | nurse
el/la abogado/a | lawyer
el/la ingeniero/a | engineer
el/la cocinero/a | cook; chef
el/la dependiente/a; el/la vendedor/a | shop assistant; sales assistant
el/la policía | police officer
el/la bombero/a | firefighter
el/la mecánico/a | mechanic
el/la peluquero/a | hairdresser
el/la veterinario/a | vet; veterinarian
el/la arquitecto/a | architect
el/la granjero/a; el/la agricultor/a | farmer
el/la científico/a | scientist
el/la programador/a | programmer
el/la diseñador/a | designer
el/la cajero/a | cashier
el/la contable; el/la contador/a | accountant
`);

topic("social", "issues", "Social issues", "Problemas sociales", `
los problemas sociales | social problems; social issues
el problema | problem
la sociedad | society
la pobreza | poverty
pobre | poor
las personas sin hogar; las personas sin techo; los sin techo | homeless people; the homeless
la vivienda | housing
el hambre | hunger
la desigualdad | inequality
la igualdad | equality
la igualdad de género | gender equality
la discriminación | discrimination
el racismo | racism
el machismo | sexism; male chauvinism
la violencia | violence
la delincuencia | crime; delinquency
el/la delincuente | criminal; offender
robar | to steal; to rob
el robo | theft; robbery
la drogadicción | drug addiction
el alcoholismo | alcoholism
el acoso | harassment; bullying
la soledad | loneliness
las personas mayores; los ancianos; la tercera edad | the elderly; elderly people; old people
la discapacidad | disability
la obesidad | obesity
la inmigración | immigration
el/la inmigrante | immigrant
el/la refugiado/a | refugee
la integración | integration
los derechos humanos | human rights
la libertad | freedom; liberty
la justicia | justice
la injusticia | injustice
la tolerancia | tolerance
respetar | to respect
la solidaridad | solidarity
la organización benéfica | charity
la ONG | NGO; non-governmental organisation
donar | to donate
el gobierno | government
la ley | law
votar | to vote
las elecciones | elections
la manifestación; la protesta | demonstration; protest
protestar | to protest
la campaña | campaign
luchar contra | to fight against; to combat
mejorar | to improve
la brecha digital | digital divide
`);

/* ────────────────────────── SHARING THE PLANET ────────────────────────── */

topic("planet", "climate", "Climate", "El clima", `
el tiempo | weather; time
¿qué tiempo hace? | what's the weather like?
hace sol | it's sunny
hace calor | it's hot
hace frío | it's cold
hace viento | it's windy
hace buen tiempo | the weather is good; it's nice weather; it's good weather
hace mal tiempo | the weather is bad; it's bad weather
llueve; está lloviendo | it's raining; it rains
nieva; está nevando | it's snowing; it snows
está nublado | it's cloudy
hay niebla | it's foggy; there is fog
hay tormenta | there's a storm; it's stormy
la lluvia | rain
la nieve | snow
el sol | sun
el viento | wind
la nube | cloud
la tormenta | storm
el huracán | hurricane
la ola de calor | heatwave; heat wave
la sequía | drought
la inundación | flood
el incendio forestal | forest fire; wildfire
el desastre natural | natural disaster
el pronóstico del tiempo; la previsión del tiempo | weather forecast
la temperatura | temperature
los grados | degrees
caluroso/a; caliente | hot; warm
frío/a | cold
húmedo/a | humid; damp; wet
seco/a | dry
templado/a | mild; temperate
tropical | tropical
las estaciones | seasons
el clima | climate
el cambio climático | climate change
el calentamiento global | global warming
el efecto invernadero | greenhouse effect; the greenhouse effect
los gases de efecto invernadero | greenhouse gases
el dióxido de carbono | carbon dioxide
la huella de carbono | carbon footprint
el nivel del mar | sea level
derretirse; fundirse | to melt
aumentar; subir | to increase; to rise
bajar; disminuir | to go down; to fall; to lower
afectar | to affect
`);

topic("planet", "geography", "Physical geography", "Geografía física", `
el paisaje | landscape; scenery
la naturaleza | nature
la montaña | mountain
la sierra; la cordillera | mountain range
el volcán | volcano
el valle | valley
la colina | hill
el río | river
el lago | lake
la cascada | waterfall
el mar | sea
el océano | ocean
la costa | coast
la playa | beach
la isla | island
la península | peninsula
el desierto | desert
la selva | jungle; rainforest
el bosque | forest; wood; woods
la llanura | plain
la cueva | cave
el glaciar | glacier
la roca | rock
la tierra | earth; land; ground
el terremoto | earthquake
el continente | continent
el país | country
la región | region
la provincia | province
la frontera | border
la población | population
el norte | north
el sur | south
el este | east
el oeste | west
situado/a; ubicado/a | located; situated
se encuentra | is located; it is located
la altura | height; altitude
montañoso/a | mountainous
llano/a; plano/a | flat
profundo/a | deep
árido/a | arid; dry
fértil | fertile
América Latina; Latinoamérica | Latin America
América del Sur; Sudamérica | South America
Centroamérica | Central America
el Caribe | the Caribbean
los Andes | the Andes
los Pirineos | the Pyrenees
el Amazonas | the Amazon
`);

topic("planet", "environment", "The environment", "El medio ambiente", `
el medio ambiente; el medioambiente | environment; the environment
el planeta | planet; the planet
la Tierra | Earth; the Earth
proteger | to protect
la contaminación | pollution
contaminar | to pollute
contaminado/a | polluted
la basura; los desechos | rubbish; trash; garbage
los residuos | waste
el vertedero | landfill; rubbish dump; dump
reciclar | to recycle
el reciclaje | recycling
el contenedor | bin; recycling bin; container
reutilizar; reusar | to reuse
reducir | to reduce
malgastar; desperdiciar | to waste
ahorrar | to save [money, energy]
el plástico | plastic
las bolsas de plástico | plastic bags
el vidrio; el cristal | glass
el cartón | cardboard
el papel | paper
la lata | can; tin
la botella | bottle
la energía | energy
las energías renovables | renewable energy; renewable energies
la energía solar | solar energy; solar power
la energía eólica | wind energy; wind power
el panel solar | solar panel
los combustibles fósiles | fossil fuels
el petróleo | oil; petroleum
el carbón | coal
los recursos naturales | natural resources
la deforestación | deforestation
talar árboles; cortar árboles | to cut down trees
el árbol | tree
plantar | to plant
la especie en peligro de extinción | endangered species
la fauna | wildlife; fauna
el ecosistema | ecosystem
sostenible; sustentable | sustainable
la sostenibilidad | sustainability
verde | green
el agua potable | drinking water
el grifo; la llave | tap; faucet
cerrar el grifo | to turn off the tap
apagar las luces; apagar la luz | to turn off the lights; to switch off the lights
la capa de ozono | ozone layer; the ozone layer
la lluvia ácida | acid rain
destruir | to destroy
dañar | to damage; to harm
el daño | damage; harm
deberíamos | we should
es fundamental | it is essential; it is fundamental
`);

topic("planet", "global", "Global issues", "Problemas globales", `
los problemas globales | global problems; global issues
el mundo | world; the world
mundial | global; worldwide; world
la globalización | globalisation; globalization
el hambre | hunger
la pobreza | poverty
la guerra | war
la paz | peace
el conflicto | conflict
el terrorismo | terrorism
la crisis | crisis
la crisis económica | economic crisis
la migración | migration
emigrar | to emigrate
los refugiados | refugees
la ayuda humanitaria | humanitarian aid
la emergencia | emergency
la enfermedad | disease; illness
la pandemia | pandemic
la vacuna | vaccine
la escasez de agua | water shortage; water scarcity
la sobrepoblación | overpopulation
la desnutrición | malnutrition
el analfabetismo | illiteracy
los países en vías de desarrollo | developing countries
los países desarrollados | developed countries
el desarrollo sostenible | sustainable development
el comercio justo | fair trade
la explotación | exploitation
el trabajo infantil | child labour; child labor
la esclavitud | slavery
el consumismo | consumerism
consumir | to consume
la seguridad alimentaria | food security
las Naciones Unidas; la ONU | the United Nations; United Nations; UN
los Objetivos de Desarrollo Sostenible | the Sustainable Development Goals; SDGs
la cooperación | cooperation
colaborar | to collaborate; to work together
resolver; solucionar | to solve; to resolve
la solución | solution
el derecho a | the right to; right to
la amenaza | threat
amenazar | to threaten
sufrir | to suffer
sobrevivir | to survive
morir | to die
la vida | life
el/la ciudadano/a | citizen
la responsabilidad | responsibility
la esperanza | hope
internacional | international
`);

/* ─────────────────────────── CORE ESSENTIALS ─────────────────────────── */

topic("core", "questions", "Question words & connectives", "Interrogativos y conectores", `
¿qué? | what?
¿quién?; ¿quiénes? | who?
¿dónde? | where?
¿adónde? | where to?
¿de dónde? | where from?
¿cuándo? | when?
¿cómo? | how?
¿por qué? | why?
¿cuál?; ¿cuáles? | which?; which one?
¿cuánto?; ¿cuánta? | how much?
¿cuántos?; ¿cuántas? | how many?
porque | because
y | and
pero | but
o | or
también | also; too
tampoco | neither; not either
sin embargo; no obstante | however
además | furthermore; in addition; besides
por eso | that's why; therefore
por lo tanto | therefore
entonces | then; so
luego | then; later
después | afterwards; after
primero | first
finalmente; por último; al final | finally
cuando | when [not a question]
si | if
aunque | although; even though
mientras | while
ya que | since; given that
como | as; like
por ejemplo | for example
es decir | that is to say; in other words
sobre todo | above all; especially
en cambio | on the other hand; instead
nunca; jamás | never
siempre | always
a veces | sometimes
a menudo; con frecuencia; frecuentemente | often
casi | almost
muy | very
bastante | quite; enough
demasiado | too; too much
`);

topic("core", "time", "Time expressions (tense markers)", "Marcadores temporales", `
hoy | today
ayer | yesterday
mañana | tomorrow
anteayer | the day before yesterday
pasado mañana | the day after tomorrow
anoche | last night
la semana pasada | last week
el fin de semana pasado | last weekend
el año pasado | last year
el verano pasado | last summer
hace dos años | two years ago
un día | one day [in a story]
de repente | suddenly
cuando era pequeño/a | when I was little; when I was small
de niño/a | as a child
antes | before; previously
ahora | now
actualmente | currently; nowadays
hoy en día | nowadays; these days
todos los días | every day
normalmente | normally; usually
generalmente; por lo general | generally; usually
de vez en cuando | from time to time; now and then
una vez a la semana | once a week
dos veces al mes | twice a month
por la mañana | in the morning
por la tarde | in the afternoon; in the evening
por la noche | at night
el lunes | on Monday
los lunes | on Mondays
temprano | early
tarde | late
pronto | soon
todavía; aún | still; yet
todavía no | not yet
ya | already
alguna vez | ever
recientemente; últimamente | recently; lately
la semana que viene; la próxima semana | next week
el año que viene; el próximo año | next year
dentro de diez años | in ten years; in ten years' time
en el futuro | in the future
algún día | someday; one day [in the future]
`);

topic("core", "opinions", "Opinions & useful phrases", "Opiniones y frases útiles", `
me gusta | I like [one thing]
me gustan | I like [plural]
me encanta | I love [a thing]
no me gusta nada | I don't like it at all
odio; detesto | I hate
prefiero | I prefer
me interesa | I'm interested in; it interests me
me molesta | it annoys me; it bothers me
me aburre | it bores me
me fascina | it fascinates me
me da igual | I don't mind; it's all the same to me
me gustaría | I would like
quisiera | I would like [polite]
creo que | I think that; I believe that
pienso que | I think that
en mi opinión | in my opinion
para mí | for me
a mi parecer | in my view
estoy de acuerdo | I agree
no estoy de acuerdo | I disagree; I don't agree
tener razón | to be right
por un lado | on one hand; on the one hand
por otro lado | on the other hand
lo bueno es que | the good thing is that
lo malo es que | the bad thing is that
lo mejor | the best thing
lo peor | the worst thing
es importante | it's important
es necesario | it's necessary
hay que | one must; you have to
tengo que | I have to
debería | I should
se puede | you can; one can
divertido/a | fun; entertaining
aburrido/a | boring
interesante | interesting
emocionante | exciting
fácil | easy
difícil | difficult; hard
útil | useful
inútil | useless
genial; estupendo/a; fantástico/a | great; brilliant; fantastic
horrible; terrible; fatal | horrible; awful; terrible
¡qué bien! | how good!; great!
¡qué pena!; ¡qué lástima! | what a shame!; what a pity!
`);

topic("core", "numbers", "Numbers", "Los números", `
uno | one; 1
dos | two; 2
tres | three; 3
cuatro | four; 4
cinco | five; 5
seis | six; 6
siete | seven; 7
ocho | eight; 8
nueve | nine; 9
diez | ten; 10
once | eleven; 11
doce | twelve; 12
trece | thirteen; 13
catorce | fourteen; 14
quince | fifteen; 15
dieciséis | sixteen; 16
diecisiete | seventeen; 17
veinte | twenty; 20
veintiuno | twenty-one; 21
veintidós | twenty-two; 22
treinta | thirty; 30
cuarenta | forty; 40
cincuenta | fifty; 50
sesenta | sixty; 60
setenta | seventy; 70
ochenta | eighty; 80
noventa | ninety; 90
cien | one hundred; a hundred; 100
ciento veinte | one hundred and twenty; a hundred and twenty; 120
quinientos | five hundred; 500
mil | one thousand; a thousand; 1000
dos mil veintiséis | two thousand and twenty-six; 2026
primero/a | first
segundo/a | second
tercero/a | third
`);

topic("core", "calendar", "Days, months & telling time", "Días, meses y la hora", `
lunes | Monday
martes | Tuesday
miércoles | Wednesday
jueves | Thursday
viernes | Friday
sábado | Saturday
domingo | Sunday
enero | January
febrero | February
marzo | March
abril | April
mayo | May
junio | June
julio | July
agosto | August
septiembre | September
octubre | October
noviembre | November
diciembre | December
la primavera | spring
el verano | summer
el otoño | autumn; fall
el invierno | winter
la fecha | date
¿qué hora es? | what time is it?
es la una | it's one o'clock; it's one
son las dos y media | it's half past two; it's two thirty
son las tres y cuarto | it's quarter past three; it's a quarter past three
son las cuatro menos cuarto | it's quarter to four; it's a quarter to four
son las diez y diez | it's ten past ten
el mediodía | midday; noon
la medianoche | midnight
el día | day
la semana | week
el mes | month
el año | year
`);
