# GDD

### Equipo de desarrollo:
Programación y arte: Diego Barba, Laura Valles, Alba Gómez y Lucas Suárez. <br/> Programación y sonido: Sergio Casanova. <br/> Programación: María Bravo.

Para ver la contribución de cada integrante, consultar [el archivo de contribuciones](contribucion.md).

## 1.	Resumen
### 1.1.	Descripción
<i>Don't Kill My Date !</i> es un videojuego en el que el jugador encarna a una hechicera que dirige una consulta en un pequeño pueblo. Allí acuden clientes con disputas románticas, a quienes ayuda creando pociones adaptadas a sus necesidades mediante la selección y preparación de distintos ingredientes.

La combinación de ingredientes y la destreza del jugador para trabajar a contrarreloj determinan la calidad y los efectos de cada poción. El resultado influye directamente en el éxito o fracaso de la cita del cliente y en su reputación como hechicero. Además, el jugador podrá explorar los alrededores para encontrarse con distintos personajes y cuidar del huerto de la ciudad. El futuro de la hechicera depende de sus decisiones.

### 1.2.	Género
Simulación/Casual.

### 1.3.	Setting
El juego se ambienta en un bosque fantástico habitado por criaturas mágicas. En este entorno, el jugador gestiona una pequeña consulta de hechicería dedicada a resolver problemas sentimentales mediante el uso de magia y alquimia. A medida que avanza la partida, llegan clientes cada vez más peculiares.

### 1.4.	Características principales
- Estilo visual pixel art con ambientación fantástica en un bosque lleno de criaturas mágicas.
-	Elaboración de pociones mediante la combinación de ingredientes con efectos específicos.
-	Atención a clientes mágicos con distintos problemas amorosos y resultados variables en sus citas.
-	Sistema de reputación que permite desbloquear distintos finales.
-	Incremento progresivo de la dificultad en las peticiones de los clientes.
- Cuidado de un huerto que afecta la reputación.
- Exploración del mapa del pueblo.

## 2.	Gameplay
### 2.1.	Objetivo del juego
El objetivo del juego es atender las peticiones de los clientes, atendiendo a sus indicaciones y realizando las pociones de la manera adecuada para el cliente adecuado.

### 2.2.	Core loops
Durante el día en el que se desarrolla la actividad comercial, el core loop es el siguiente:
1.	Antes de comenzar el día podemos cuidar un huerto y interactuar con algunos personajes que hay en el pueblo.
2.	Una vez abierta la consulta, van entrando clientes a la tienda uno por uno y nos comentan su petición.
3.	Realizamos la poción con los ingredientes y para el destinatario adecuados.
4.	Termina el día y recibimos noticias de si las citas han ido bien o mal y de la reputación conseguida o perdida.

![Core loop](assets/img/core_loop.svg)

## 3.	Mecánicas

### 3.1.	Diálogo

Todos los personajes que entran a la tienda interactúan con el jugador a través del mismo sistema base de diálogo para plantear su encargo. El pipeline completo es el siguiente:

**1. Selección de plantilla**

El sistema elige una plantilla de texto según la dificultad del día actual, definida en `daysConfig.json`. Existen 3 plantillas por nivel (`facil`, `medio`, `dificil`), cada una con una redacción progresivamente más críptica y literaria. La plantilla contiene 6 etiquetas dinámicas:

```
{saludo}  {raza_objetivo}  {color}  {sabor}  {consistencia}  {temperatura}  {forma_frasco}  {despedida}
```

**2. Sustitución de sinónimos**

Cada etiqueta se reemplaza por un término aleatorio del `diccionario.json` correspondiente a la dificultad activa. Por ejemplo, la etiqueta `{sabor}` con ingrediente *dulce*:

| Dificultad | Ejemplos de sustitución |
| :--- | :--- |
| `facil` | "un sabor dulce", "un gusto azucarado" |
| `medio` | "un toque empalagoso", "un regusto a miel" |
| `dificil` | "notas de néctar celestial", "un dulzor que empalague" |

Lo mismo aplica para `{color}`, `{consistencia}`, `{temperatura}`, `{forma_frasco}` y `{raza_objetivo}`. El jugador debe deducir el ingrediente correcto a partir del sinónimo, siendo este el núcleo del desafío en dificultades altas.

**3. Tono del diálogo**

`{saludo}` y `{despedida}` se eligen aleatoriamente de sus respectivos pools en el diccionario, independientes de la dificultad. Los saludos tienen 5 registros: *neutro, educado, borde, nervioso* y *misterioso*, lo que aporta variedad de personalidad sin afectar la mecánica.

**4. Ejemplo completo**

Un cliente en dificultad `dificil` con ingredientes *dulce / rojo / machacado / frío / corazón* podría generar:

> *"Los astros me han traído hasta aquí. Mi corazón ansía desesperadamente el afecto de una hija de las corrientes cristalinas. Requiere de tu mayor arte: un elixir con el color de la sangre que posea notas de néctar celestial. Confío en que la textura de la mezcla quede reducida a una pasta fina e irreconocible y que la poción repose fría como el hielo. Presérvalo en un vaso tallado con la silueta de un corazón. Confío en tu mano."*

### 3.2. Libro
PÁGINA DE COMPATIBILIDAD
- Abrir el libro por la página de compatibilidad. En esta aparecen las 6 razas en círculo y una interrogación en el medio.
- Seleccionar 2 de las 6 razas que aparecen para consultar su compatibilidad (ver <i>punto 5.1.2.</i> para más información sobre la compatibilidad entre razas). Saldrá en el medio el color de la probeta que tiene que seleccionar.

PÁGINA DE PLANTAS
- Abrir el libro por la página de plantas. En esta hay información del sabor de cada una.

### 3.2.	Preparación de pociones
El jugador tiene que combinar 5 atributos distintos en el caldero a la hora de preparar una poción.

#### 3.2.1. Compatibilidad razas (olor)
Seleccionar 1 de las 3 probetas disponibles para dar olor a la poción. Deslizar la probeta elegida hasta el caldero y soltarla.

#### 3.2.2. Plantas (sabor)
Seleccionar 1 de las 5 plantas disponibles. Para procesarlas existen las siguientes mecánicas, según la textura que se quiere conseguir:
- Sin procesar: Deslizar la planta elegida al caldero y soltarla para echarla entera.
- Cortar: Deslizar la planta elegida a la tabla de cortar y soltarla. Aparecerá en la pantalla una barra horizontal con zonas marcadas y un cuchillo deslizándose sobre ella de un lado a otro. El jugador tendrá que hacer click sobre las zonas marcadas sin equivocarse para cortar bien la planta. Si hace click fuera de las zonas, la satisfacción del cliente bajará. Habrá el mismo número de intentos que de zonas marcadas.
- Machacar: Elegir el mortero. Irán apareciendo en la pantalla círculos en distintas posiciones. El jugador tendrá que hacerles click antes de que desaparezcan. Cuantos más círculos no consiga dar a tiempo, más bajará la satisfacción del cliente.

#### 3.2.3. Polvos (color)
Seleccionar 1 o varios de los 3 cuencos con polvos de colores disponibles para conseguir el color de poción deseado. Cada vez que el jugador elija un polvo, saldrá el color de la mezcla en un cuenco más grande. En caso de equivocación, se podrá descartar la mezcla pulsando un botón y tirarla a la basura. Una vez se haya conseguido el color deseado, se podrá pulsar un botón que permitirá seleccionar y deslizar el cuenco con la mezcla al caldero.

#### 3.2.4. Fuego (temperatura)
Una vez metidos los 3 ingredientes anteriores al caldero, fuego naranja (caliente) o frío (azul). Barra con 3 temperaturas que sube/baja según el fuego.

#### 3.2.5. Frasco (forma)
Elegir la forma del frasco. Verter el contenido del caldero al frasco con precisión.


### 3.3.	Sistemas de puntuación
### 3.4.	Sistemas de reseñas

## 4.	Interfaz
### 4.1.	Controles
Ratón
### 4.2.	Cámara 
CONSULTA: Cámara fija y vista en primera persona. <br/>
PUEBLO: Vista top-down.

### 4.3.	HUD
### 4.4.	Menús

## 5.	Mundo del juego
### 5.1.	Personajes
#### 5.1.1. Razas
- Humanos
- Hadas (aire)
- Ninfas (agua)
- Kitsunes (fuego)
- Elfos (planta)
- Gnomos (tierra)

#### 5.1.2. Compatibilidad
| | Humanos | Hadas | Ninfas | Kitsunes | Elfos | Gnomos |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Humanos** | 🟢 | 🟢 | ⚪ | ⚪ | 🔴 | 🔴 |
| **Hadas** | 🟢 | 🟢 | 🔴 | ⚪ | ⚪ | 🔴 |
| **Ninfas** | ⚪ | 🔴 | 🟢 | 🔴 | 🟢 | ⚪ |
| **Kitsunes** | ⚪ | ⚪ | 🔴 | 🟢 | 🔴 | 🟢 |
| **Elfos** | 🔴 | ⚪ | 🟢 | 🔴 | 🟢 | ⚪ |
| **Gnomos** | 🔴 | 🔴 | ⚪ | 🟢 | ⚪ | 🟢 |

> 🟢 = Buena <br/> ⚪ = Neutra <br/> 🔴 = Mala

#### 5.2. Clientes
Los clientes son el motor narrativo y mecánico de la tienda. Acuden a la consulta buscando ayuda mágica para sus problemas y se dividen en dos grandes categorías, compartiendo un mismo núcleo para procesar sus textos.

#### 5.2.1. Clientes Normales
Son la principal fuente de ingresos y reputación durante el bucle de juego diario, manteniendo el flujo constante de la consulta.

* **Generación Modular:** Su aspecto se construye de forma dinámica. El sistema ensambla partes intercambiables. Primero el tono de piel, que se usa para elegir cuerpo, nariz y boca; un peinado; un color para pelo, cejas y otros features que lo requieran, color de ojos y ropa de la raza seleccionada aleatoriamente.

Aquí una tabla con todas los sprites utilizados para los clientes:

---

##### Cuerpos Base

| Capa | Opción 1 | Opción 2 | Opción 3 |
| :--- | :---: | :---: | :---: |
| **Cuerpos** | <img src="assets/sprites/npcs/cuerpo_1.png" width="64"> | <img src="assets/sprites/npcs/cuerpo_2.png" width="64"> | <img src="assets/sprites/npcs/cuerpo_3.png" width="64"> |

---

##### Ropa por Raza

| Raza | Vista |
| :--- | :---: |
| **Elfo** | <img src="assets/sprites/npcs/ropa_elfo.png" width="64"> |
| **Gnomo** | <img src="assets/sprites/npcs/ropa_gnomo.png" width="64"> |
| **Hada** | <img src="assets/sprites/npcs/ropa_hada.png" width="64"> |
| **Humano** | <img src="assets/sprites/npcs/ropa_humano.png" width="64"> |
| **Kitsune** | <img src="assets/sprites/npcs/ropa_kitsune.png" width="64"> |
| **Madre** | <img src="assets/sprites/npcs/ropa_madre.png" width="64"> |
| **Ninfa** | <img src="assets/sprites/npcs/ropa_ninfa.png" width="64"> |

---

##### Features Especiales por Raza

| Raza | Vista |
| :--- | :---: |
| **Gnomo** | <img src="assets/sprites/npcs/gnomo_features.png" width="64"> |
| **Hada** | <img src="assets/sprites/npcs/hada_feautures.png" width="64"> |
| **Ninfa** | <img src="assets/sprites/npcs/ninfa_feautures.png" width="64"> |
| **Kitsune** — Azul | <img src="assets/sprites/npcs/kitsune_feautures_azul.png" width="64"> |
| **Kitsune** — Negro | <img src="assets/sprites/npcs/kitsune_feautures_negro.png" width="64"> |
| **Kitsune** — Rojo | <img src="assets/sprites/npcs/kitsune_feautures_rojol.png" width="64"> |
| **Kitsune** — Rosa | <img src="assets/sprites/npcs/kitsune_feautures_rosa.png" width="64"> |
| **Kitsune** — Rubio | <img src="assets/sprites/npcs/kitsune_feautures_rubiol.png" width="64"> |
| **Kitsune** — Verde | <img src="assets/sprites/npcs/kitsune_feautures_verde.png" width="64"> |

---

##### Ojos

| Capa / Color | Vista |
| :--- | :---: |
| **Amarillos** | <img src="assets/sprites/npcs/ojos_amarillos.png" width="64"> |
| **Azules** | <img src="assets/sprites/npcs/ojos_azules.png" width="64"> |
| **Marrones** | <img src="assets/sprites/npcs/ojos_marrones.png" width="64"> |
| **Rojos** | <img src="assets/sprites/npcs/ojos_rojos.png" width="64"> |
| **Rosas** | <img src="assets/sprites/npcs/ojos_rosas.png" width="64"> |
| **Verdes** | <img src="assets/sprites/npcs/ojos_verdes.png" width="64"> |
| **Enfadados** | <img src="assets/sprites/npcs/ojos_enfadados.png" width="64"> |
| **Felices** | <img src="assets/sprites/npcs/ojos_felices.png" width="64"> |

---

##### Pelo — Estilo 1

| Color | Vista |
| :--- | :---: |
| **Azul** | <img src="assets/sprites/npcs/pelo_1_azul.png" width="64"> |
| **Negro** | <img src="assets/sprites/npcs/pelo_1_negro.png" width="64"> |
| **Rojo** | <img src="assets/sprites/npcs/pelo_1_rojo.png" width="64"> |
| **Rosa** | <img src="assets/sprites/npcs/pelo_1_rosa.png" width="64"> |
| **Rubio** | <img src="assets/sprites/npcs/pelo_1_rubiol.png" width="64"> |
| **Verde** | <img src="assets/sprites/npcs/pelo_1_verde.png" width="64"> |

##### Pelo — Estilo 2

| Color | Vista |
| :--- | :---: |
| **Azul** | <img src="assets/sprites/npcs/pelo_2_azul.png" width="64"> |
| **Gris** | <img src="assets/sprites/npcs/pelo_2_gris.png" width="64"> |
| **Negro** | <img src="assets/sprites/npcs/pelo_2_negro.png" width="64"> |
| **Rojo** | <img src="assets/sprites/npcs/pelo_2_rojo.png" width="64"> |
| **Rosa** | <img src="assets/sprites/npcs/pelo_2_rosa.png" width="64"> |
| **Rubio** | <img src="assets/sprites/npcs/pelo_2_rubio.png" width="64"> |
| **Verde** | <img src="assets/sprites/npcs/pelo_2_verde.png" width="64"> |

##### Pelo — Estilo 3

| Color | Vista |
| :--- | :---: |
| **Azul** | <img src="assets/sprites/npcs/pelo_3_azul.png" width="64"> |
| **Negro** | <img src="assets/sprites/npcs/pelo_3_negro.png" width="64"> |
| **Rojo** | <img src="assets/sprites/npcs/pelo_3_rojo.png" width="64"> |
| **Rosa** | <img src="assets/sprites/npcs/pelo_3_rosa.png" width="64"> |
| **Rubio** | <img src="assets/sprites/npcs/pelo_3_rubio.png" width="64"> |
| **Verde** | <img src="assets/sprites/npcs/pelo_3_verde.png" width="64"> |

---

##### Cejas

| Color | Vista |
| :--- | :---: |
| **Azules** | <img src="assets/sprites/npcs/cejas_normales_azules.png" width="64"> |
| **Negras** | <img src="assets/sprites/npcs/cejas_normales_negras.png" width="64"> |
| **Rojas** | <img src="assets/sprites/npcs/cejas_normales_rojas.png" width="64"> |
| **Rosas** | <img src="assets/sprites/npcs/cejas_normales_rosas.png" width="64"> |
| **Rubias** | <img src="assets/sprites/npcs/cejas_normales_rubias.png" width="64"> |
| **Verdes** | <img src="assets/sprites/npcs/cejas_normales_verdes.png" width="64"> |

---

##### Bocas

| Expresión | Vista |
| :--- | :---: |
| **Feliz** | <img src="assets/sprites/npcs/boca_feliz.png" width="64"> |
| **Enfadada** | <img src="assets/sprites/npcs/boca_enfadada.png" width="64"> |
| **Normal 1** | <img src="assets/sprites/npcs/boca_normal_1.png" width="64"> |
| **Normal 2** | <img src="assets/sprites/npcs/boca_normal_2.png" width="64"> |
| **Normal 3** | <img src="assets/sprites/npcs/boca_normal_3.png" width="64"> |

---

##### Narices

| Variante | Vista |
| :--- | :---: |
| **Variante 1** | <img src="assets/sprites/npcs/nariz_1.png" width="64"> |
| **Variante 2** | <img src="assets/sprites/npcs/nariz_2.png" width="64"> |
| **Variante 3** | <img src="assets/sprites/npcs/nariz_3.png" width="64"> |

---

##### Orejas

| Tipo | Opción 1 | Opción 2 | Opción 3 |
| :--- | :---: | :---: | :---: |
| **Elfo / Hada** | <img src="assets/sprites/npcs/orejas_1_elfo_hada.png" width="64"> | <img src="assets/sprites/npcs/orejas_2_elfo_hada.png" width="64"> | <img src="assets/sprites/npcs/orejas_3_elfo_hada.png" width="64"> |
| **Ninfa** | <img src="assets/sprites/npcs/orejas_ninfa_1.png" width="64"> | <img src="assets/sprites/npcs/orejas_ninfa_2.png" width="64"> | <img src="assets/sprites/npcs/orejas_ninfa_3.png" width="64"> |

---

##### Accesorios Especiales

| Accesorio | Vista |
| :--- | :---: |
| **Gafas** | <img src="assets/sprites/npcs/gafas.png" width="64"> |
| **Gorro Inspector** | <img src="assets/sprites/npcs/gorro_inspector.png" width="64"> |

---

* **Construcción por Plantillas Aleatorias:** Los requisitos de su poción se deciden completamente al azar. Para generar su texto de presentación, el juego elige y une plantillas aleatorias. Una vez montada la estructura, se le aplica el sistema general de sustitución de sinónimos.
* **Reacción:** Sus respuestas al recibir la poción son puramente visuales y mecánicas (animaciones genéricas de celebración o enfado), **sin requerir diálogos de desenlace**.

#### 5.2.2. Clientes Especiales (Scriptados)
Personajes únicos con diseños fijos y motivaciones específicas que aportan lore y contexto sobre el mundo del juego. Toda su lógica narrativa se controla desde archivos de configuración centralizados.
* **Textos Fijos:** A diferencia de los [clientes normales](#5.2.1.-clientes-normales), estos personajes no eligen una plantilla aleatoria; su diálogo de presentación está completamente personalizado para narrar su trasfondo e historia personal. Sin embargo, **sí que utilizan el sistema general de sinónimos**: sus textos contienen las mismas etiquetas dinámicas para que las pistas de los ingredientes cambien según la dificultad seleccionada.
* **Diálogos de Resolución:** Cuentan con líneas de texto adicionales tras recibir el encargo. El sistema evalúa la calidad de la mezcla y desencadena una de tres respuestas exclusivas:
  * **Éxito (Calidad >= 80%):** El cliente resuelve su problema de forma óptima y aparecerán en la zona topdown.
  * **Neutral (Calidad 50% - 79%):** El resultado es pasable. Soluciona el problema a medias, dejando una sensación agridulce.
  * **Fracaso (Calidad < 50%):** La poción resulta perjudicial, empeorando la situación del cliente y afectando gravemente la reputación.
* **Animaciones Únicas:** Ejecutan comportamientos físicos exclusivos según la situación, como animaciones en bucle durante su espera o salidas animadas.

#### 5.2.3. Clientes Especiales (Scriptados)

Personajes únicos con diseños fijos y motivaciones específicas que aportan lore y contexto sobre el mundo del juego. Toda su lógica narrativa se controla desde `scriptedNpcs.json`.

---

###### Ezarel, el Casanova

> *"Demuéstrame lo que vales, joven alquimista."*

Elfo de clase alta con una larga relación con la tienda, ya que era cliente habitual de la tía Agatha. Acude antes de cada cita para asegurarse de tener ventaja, aunque atribuye todo el mérito de sus conquistas a su "encanto natural". Es el primer cliente especial que visita la consulta y actúa como introducción al sistema de diálogos scriptados. Si se le atiende bien, revela la existencia de la cueva del oeste, clave para encontrar a la madre.

**Sprite completo:** `// TODO: captura del sprite completo`

**Poción requerida:** Raza objetivo: elfos · Sabor: dulce · Color: rojo · Consistencia: entera · Temperatura: frío · Frasco: estrella

---

###### Thalassa de las Aguas Claras

> *"Las raíces oscuras están envenenando el río..."*

Ninfa que ha forjado una alianza secreta con humanos para purificar los manantiales del bosque antes de que una oscuridad desconocida los destruya. Su encargo no es romántico en apariencia, sino que el catalizador mágico que necesita para el ritual de purificación resulta ser también un filtro de amor. Representa la tensión entre las razas y su capacidad de cooperar ante una amenaza común.

**Sprite completo:** `// TODO: captura del sprite completo`

**Poción requerida:** Raza objetivo: humanos · Sabor: salado · Color: azul · Consistencia: cortada · Temperatura: del tiempo · Frasco: corazón

---

###### David, ¿el gnomo?

> *"Soy ese cono parlante de ahí abajo."*

Gnomo enamorado de una elfa que literalmente no le ve, ya que le pasa por alto debido a su estatura. Acude a la tienda buscando un "estirón mágico" que le permita estar a la altura (en todos los sentidos) de su pretendida. Su historia es la más cómica del juego y cuenta con una animación de éxito exclusiva en la que crece visiblemente al tomar la poción.

**Sprite completo:** `// TODO: captura del sprite completo`

**Poción requerida:** Raza objetivo: elfos · Sabor: dulce · Color: rojo · Consistencia: cortada · Temperatura: frío · Frasco: estrella

---

###### 🧚 Campanita, Tejedora de Luz

> *"Mis alas se han vuelto rígidas y he perdido la capacidad de alzar el vuelo."*

Hada alegre y parlanchina con una cita pendiente en lo alto de una montaña con un gnomo al que está enseñando a perder el vértigo. El problema: sus alas se han vuelto rígidas y no puede volar. Necesita una poción que restaure su aleteo a tiempo. Su animación de espera muestra las alas batiendo en bucle, y su salida de éxito es la única del juego en la que el personaje sale volando literalmente por arriba de la pantalla.


**Sprite completo:** `// TODO: captura del sprite completo`

**Poción requerida:** Raza objetivo: gnomos · Sabor: ácido · Color: amarillo · Consistencia: machacada · Temperatura: frío · Frasco: estrella

---

###### Kaelen el Errante

> *"Tu mirada me sigue resultando muy familiar."*

Humano que ha viajado semanas desde su aldea, cuyas cosechas se marchitan bajo una plaga desconocida. Busca el poder purificador de las ninfas para salvar a su pueblo. Es uno de los personajes con más carga narrativa implícita: sus comentarios sobre "una chica de su aldea que desapareció" y la familiaridad que siente con la protagonista apuntan a una conexión con el lore de la madre. Si se le atiende bien, se queda en el pueblo cercano disponible para hablar.

**Sprite completo:** `// TODO: captura del sprite completo`

**Poción requerida:** Raza objetivo: ninfas · Sabor: amargo · Color: verde · Consistencia: machacada · Temperatura: calor · Frasco: normal

---

###### Akira, Sombra del Templo

> *"Los faroles de nuestro santuario ancestral se han apagado."*

Kitsune de carácter frío y ceremonioso. Los faroles de su santuario ancestral se han apagado y, según la tradición, solo la chispa de un hada puede devolver el fuego espiritual. Acude a la tienda sin mostrar emociones, pero si se le atiende bien revela un lado más cercano y ofrece enseñar "trucos interesantes" a la protagonista. Es el personaje con el tono más solemne y misterioso de todos los scriptados.

**Sprite completo:** `// TODO: captura del sprite completo`

**Poción requerida:** Raza objetivo: hadas · Sabor: umami · Color: naranja · Consistencia: cortada · Temperatura: calor · Frasco: estrella

---

###### Inspector Real

> *"Por orden del alcalde, esta tienda queda clausurada de inmediato."*

No es un cliente al uso, sino el desenlace negativo del juego. Aparece si la reputación de la protagonista cae demasiado. No hace ningún encargo: simplemente entra, declara la clausura de la tienda y destierra a la protagonista del pueblo. No tiene diálogo de resolución ni aparece en el top-down.

**Sprite completo:** `// TODO: captura del sprite completo`

---

###### Mujer Misteriosa

> *"Hola, hija mía. Ha llegado el momento de dejar de esconderme en esta cueva."*

Personaje central del arco narrativo principal, aunque su verdadera identidad solo se desvela tras múltiples visitas a la cueva del oeste. Se presenta como una mujer misteriosa que vive escondida, y a lo largo de 5 visitas progresivas va revelando su historia: es la madre de la protagonista, humana que se enamoró del anterior rey de los elfos y tuvo que desaparecer para protegerse. Su diálogo en el top-down es el único del juego que avanza de forma secuencial visita a visita, revelando el lore de la protagonista de forma gradual.

**Sprite completo:** `// TODO: captura del sprite completo`

**Poción requerida:** Raza objetivo: elfos · Sabor: dulce · Color: rojo · Consistencia: machacada · Temperatura: calor · Frasco: corazón

---

###### Tía Agatha

> *"Creo que es hora de que esta tienda pase a ser tuya."*

No aparece como cliente sino como personaje de cierre narrativo. Es la propietaria original de la tienda y quien la dejó a cargo de la protagonista. Aparece al final del juego para ceder oficialmente la tienda, reconocer el trabajo realizado y quedarse como apoyo permanente. Junto a la madre, forma el núcleo del arco narrativo de la protagonista.

**Sprite completo:** `// TODO: captura del sprite completo`

### 5.2.	Objetos
#### 5.2.1 Cocina

- Probetas

| | Roja | Gris | Verde |
| :--- | :---: | :---: | :---: |
| **Sprite** | <img src="assets/sprites/kitchen/probeta_roja.png" width="16"> | <img src="assets/sprites/kitchen/probeta_gris.png" width="16"> | <img src="assets/sprites/kitchen/probeta_verde.png" width="16"> |

- Ingredientes

| | Seta | Bayas | Raíz | Algas | Cristal |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Sabor** | Umami | Ácido | Amargo | Dulce | Salado |
| **Sprite 1** | <img src="assets/sprites/kitchen/frasco_setas.png" width="32"> | <img src="assets/sprites/kitchen/frasco_bayas.png" width="32"> | <img src="assets/sprites/kitchen/frasco_raices.png" width="32"> | <img src="assets/sprites/kitchen/frasco_algas.png" width="32"> | <img src="assets/sprites/kitchen/frasco_cristal.png" width="32"> |
| **Sprite 2** | <img src="assets/sprites/kitchen/seta.png" width="32"> | <img src="assets/sprites/kitchen/baya.png" width="32"> | <img src="assets/sprites/kitchen/raiz.png" width="32"> | <img src="assets/sprites/kitchen/alga.png" width="32"> | <img src="assets/sprites/kitchen/cristal.png" width="32"> |

- Polvos

| | Rojo | Azul | Amarillo |
| :--- | :---: | :---: | :---: |
| **Sprite** | <img src="assets/sprites/kitchen/cuenco_rojo.png" width="32"> | <img src="assets/sprites/kitchen/cuenco_azul.png" width="32"> | <img src="assets/sprites/kitchen/cuenco_amarillo.png" width="32"> |

- Frascos

| | Normal | Corazón | Estrella |
| :--- | :---: | :---: | :---: |
| **Sprite** | <img src="assets/sprites/kitchen/pocion_normal_vacia.png" width="32"> | <img src="assets/sprites/kitchen/pocion_corazon_vacia.png" width="32"> | <img src="assets/sprites/kitchen/pocion_estrella_vacia.png" width="32"> |

## 6.	Estética y contenido
## 7.	Experiencia de juego
## 8.	Producción
## 9.	Referencias
