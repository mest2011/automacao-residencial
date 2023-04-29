#include "Ultrasonic.h" //INCLUSÃO DA BIBLIOTECA NECESSÁRIA PARA FUNCIONAMENTO DO CÓDIGO
#include "ArduinoSort.h"
#include <FastLED.h>

//LEDS
#define LED_PIN     5
#define NUM_LEDS    23
CRGB leds[NUM_LEDS];
int state = 1;
int lastState = 1;

const int echoPin = 7; //PINO DIGITAL UTILIZADO PELO HC-SR04 ECHO(RECEBE)
const int trigPin = 6; //PINO DIGITAL UTILIZADO PELO HC-SR04 TRIG(ENVIA)
const int ledPin = 13;
const int historyDistanceLength = 100;
const int timeOn = 10000;
const int readInterval = 50;

Ultrasonic ultrasonic(trigPin,echoPin); //INICIALIZANDO OS PINOS DO ARDUINO
 
int distancia; //VARIÁVEL DO TIPO INTEIRO
String result; //VARIÁVEL DO TIPO STRING
int history[historyDistanceLength];
int positionHistoryDistance = 0;
int medianDistance = 0;
  
void setup(){
  FastLED.addLeds<WS2812B, LED_PIN, GRB>(leds, NUM_LEDS);
  FastLED.setBrightness(200);
  pinMode(ledPin, OUTPUT);
  pinMode(echoPin, INPUT); //DEFINE O PINO COMO ENTRADA (RECEBE)
  pinMode(trigPin, OUTPUT); //DEFINE O PINO COMO SAIDA (ENVIA)
  Serial.begin(9600); //INICIALIZA A PORTA SERIAL
  for(int x = 0; x < historyDistanceLength; x++ ){
    history[x] = 110;
  }
}
  
void loop(){
  //Leds variebles
  int fade_time = 50; // tempo para o efeito de fade in, em milissegundos
  int interval = 25; // intervalo entre os LEDs, em milissegundos
  static int current_led = 0;
  static int led_strip[NUM_LEDS];
  static unsigned long last_time_led = 0;
  static unsigned long last_time_fade = 0;

  //Ultrasonic variebles
  static long lastTimeOn = 0;
  static long lastRead = 0;

  if(state == 1){
    if(state != lastState){
      lastState = 1;
      for(int led = 0; led <= NUM_LEDS; led++){
         leds[led].setRGB(255, 255, 255);
         FastLED.show();
         delay(fade_time);
      }
    }
  }else{
    if(state != lastState){
      lastState = 0;
      for(int led = NUM_LEDS; led >= 0; led--){
         leds[led].setRGB(0, 0, 0);
         FastLED.show();
         delay(fade_time);
      }
    }
  }
  



  /*if(state == 1){
    if (millis() - last_time_led >= interval) {
      last_time_led = millis();
      if(current_led < 256){
        led_strip[current_led] = 1;
        current_led++;
      }  
    } 

    if (millis() - last_time_fade >= fade_time) {
      last_time_fade = millis();
      for(int led = 0; led < NUM_LEDS; led++){
        if(led_strip[led] > 0 && led_strip[led] < 255){
          led_strip[led]+=2;
          if(led_strip[led] > 255){
            led_strip[led] = 255;
          }
          leds[led].setRGB(led_strip[led], led_strip[led], led_strip[led]);
        }
      }
    }
  }

  
  if(state == 0){
    if (millis() - last_time_fade >= fade_time) {
      last_time_fade = millis();
      for(int led = NUM_LEDS; led >= 0; led--){
        led_strip[led]--;
        if(led_strip[led] < 0){
            led_strip[led] = 0;
        }
        
        leds[led].setRGB(led_strip[led], led_strip[led], led_strip[led]);
      }
    }

  }*/

  


  

  if(millis() - lastRead >= readInterval){
    lastRead = millis();
    hcsr04();
    history[positionHistoryDistance] = distancia;
    mediana();
    Serial.println(result);
    Serial.print(" ");
  }

  if(millis() - lastTimeOn >= timeOn){
    digitalWrite(ledPin, LOW);
    state = 0;
  }
  if(calcularDiferencaPorcentagem(medianDistance, distancia) > 20){
    digitalWrite(ledPin, HIGH);
    lastTimeOn = millis();
    state = 1;
  }

  positionHistoryDistance++;
  if(positionHistoryDistance > historyDistanceLength){
    positionHistoryDistance = 0;
  }
}

 void mediana(){
  // ordena o array em ordem crescente
  sortArray(history, historyDistanceLength);
  
  // calcula o índice do elemento mediano
  int medianaIndex = historyDistanceLength / 2;
  
  // verifica se o array tem um número par ou ímpar de elementos
  if (historyDistanceLength % 2 == 0) {
    // se for par, a mediana é a média dos dois elementos do meio
    int mediana = (history[medianaIndex - 1] + history[medianaIndex]) / 2;
    medianDistance = mediana;
  } else {
    // se for ímpar, a mediana é o elemento do meio
    int mediana = history[medianaIndex];
    Serial.print("Mediana: ");
    medianDistance = mediana;
  }
 }

 float calcularDiferencaPorcentagem(int valor1, int valor2) {
  // calcula a diferença entre os valores
  float diferenca = valor1 - valor2;
  
  // calcula a diferença em porcentagem
  float diferencaPorcentagem = (diferenca / valor1) * 100.0;
  
  return diferencaPorcentagem;
}

 
//MÉTODO RESPONSÁVEL POR CALCULAR A DISTÂNCIA
void hcsr04(){
    digitalWrite(trigPin, LOW); //SETA O PINO 6 COM UM PULSO BAIXO "LOW"
    delayMicroseconds(2); //INTERVALO DE 2 MICROSSEGUNDOS
    digitalWrite(trigPin, HIGH); //SETA O PINO 6 COM PULSO ALTO "HIGH"
    delayMicroseconds(10); //INTERVALO DE 10 MICROSSEGUNDOS
    digitalWrite(trigPin, LOW); //SETA O PINO 6 COM PULSO BAIXO "LOW" NOVAMENTE
    //FUNÇÃO RANGING, FAZ A CONVERSÃO DO TEMPO DE
    //RESPOSTA DO ECHO EM CENTIMETROS, E ARMAZENA
    //NA VARIAVEL "distancia"
    distancia = (ultrasonic.Ranging(CM)); //VARIÁVEL GLOBAL RECEBE O VALOR DA DISTÂNCIA MEDIDA
    result = distancia; //VARIÁVEL GLOBAL DO TIPO STRING RECEBE A DISTÂNCIA(CONVERTIDO DE INTEIRO PARA STRING)
 }
