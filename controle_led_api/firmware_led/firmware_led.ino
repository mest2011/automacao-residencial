#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>

const char *ssid = "mest tp";
const char *password = "19800524";

int BLUE = 04;  //porta fisica : d02
int RED = 12;   //porta fisica : d06
int GREEN = 14; //porta fisica : d05


int r = 0;
int g = 0;
int b = 0;

double intensidade = 1.0;


//Configuracao da API
const char *nameDevice = "rgb";
char url[255];
const char *url_p1 = "http://api.mesttech.com.br/iot/?name=";
const char *url_p2 = "&status=status";

const char *url_api_laravel = "http://mesttech.com.br/api/iot_api/public/api/state/id1";

//Outras variaveis
int contadorDeErros = 0;

void setup()
{
  pinMode(BLUE, OUTPUT);

  digitalWrite(BLUE, LOW);

  Serial.begin(115200);
  Serial.write(12);
  WiFi.begin(ssid, password);

  doConcat(url_p1, nameDevice, url);
  doConcat(url, url_p2, url); 
  
  while (WiFi.status() != WL_CONNECTED)
  {
    error("Connectando ao WIFI...", 0);
  }
}

void loop()
{

  if (WiFi.status() == WL_CONNECTED)
  {
    HTTPClient http; //Object of class HTTPClient
    http.begin(url_api_laravel);
    int httpCode = http.GET();

    if (httpCode > 0)
    {
      contadorDeErros = 0;
      
      const size_t bufferSize = JSON_OBJECT_SIZE(2) + JSON_OBJECT_SIZE(3) + JSON_OBJECT_SIZE(5) + JSON_OBJECT_SIZE(8) + 370;
      DynamicJsonBuffer jsonBuffer(bufferSize);
      JsonObject &root = jsonBuffer.parseObject(http.getString());

      int id = (int)root["id_lampada"];
      int state = (int)root["status"];
      const char *name = root["nome"];
      int tempo = (int)root["tempo"];
      const char *funcao = root["funcao"];
      const char *cor = root["cor"];
      intensidade = (double)root["intensidade"] / 100;
      r = 4 * (int)root["cores"]["r"];
      g = 4 * (int)root["cores"]["g"];
      b = 4 * (int)root["cores"]["b"];

      Serial.println("Resposta da Api: \n");
      Serial.print("Nome da lampada: ");
      Serial.println(name);
      Serial.print("Estado da lampada: ");
      Serial.println(state);
      Serial.print("Tempo: ");
      Serial.println(tempo);
      Serial.print("Funcao: ");
      Serial.println(funcao);
      Serial.print("Intensidade: ");
      Serial.println(intensidade * 100);
      Serial.print("Cor em HEX: ");
      Serial.println(cor);
      Serial.println("Cor em RGB: ");
      Serial.print("Red: ");
      Serial.println(r);
      Serial.print("Green: ");
      Serial.println(g);
      Serial.print("Blue: ");
      Serial.println(b);

      setIntensidade();

      if (state == 0)
      {
        changeState(state);
        delay(3000);
      }
      else
      {
        if ((String)funcao == "fade")
        {
          fadeInOut(tempo);
        }
        else if ((String)funcao == "blink")
        {
          stroble(tempo);
        }
        else if ((String)funcao == "carrossel")
        {
          carrossel(tempo);
        }else{
          setColor(r, g, b);
          delay(3000);
        }
      }
    }
    else
    {
      if(contadorDeErros >= 3){
        error("Erro na requisição dos dados da API!", 1);
      }else{
        contadorDeErros++;
        delay(2000);
      }
    }
    http.end(); //Close connection
  }
  else
  {
    error("Connectando ao WIFI...", 0);
  }
}

void changeState(int state)
{
  if (state == 1)
  {
    setColor(r, g, b);
  }
  else
  {
    analogWrite(RED, 0);
    analogWrite(GREEN, 0);
    analogWrite(BLUE, 0);
  }
}

void flame()
{
}

void setColor(int r, int g, int b)
{  
  analogWrite(RED, r);
  analogWrite(GREEN, g);
  analogWrite(BLUE, b);
}

void setIntensidade(){
  r = r * intensidade;
  g = g * intensidade;
  b = b * intensidade;
}

//Funcoes internas
void doConcat(const char *a, const char *b, char *out) {
    strcpy(out, a);
    strcat(out, b);
}

//------------Efeitos-------------

void error(String msg, int type)
{
  if(type == 0){
    r = 1023;
    g = 0;
    b = 0;
  }
  if(type == 1){
    r = 920;
    g = 644;
    b = 0;
  }
  
  Serial.println(msg);
  fadeInOut(10);
}

void stroble(int intervalo)
{
  for (int i = 0; i < 100; i++)
  {
    changeState(1);
    delay(intervalo);
    changeState(0);
    delay(intervalo);
  }
}

void fadeInOut(int tempo)
{
  for(int execution_fade = 0;execution_fade < 1; execution_fade++){
    for (double i = 1.0; i > 0; i=i-0.001)
    {
      setColor((r*i), (g*i), (b*i));
      delay(tempo / 10);
    }
    
    for (double i = 0.0; i < 1; i=i+0.001)
    {
      setColor((r*i), (g*i), (b*i));
      delay(tempo / 10);
    }
  }
  
  
}

void carrossel(int tempo)
{
  tempo = tempo/5;
  int rtemp = 0;
  int gtemp = 0;
  int btemp = 1023;
  //sobe verde
  for (gtemp = 0; gtemp < 1023; gtemp = gtemp + 5)
  {
    setColor((rtemp * intensidade), (gtemp * intensidade), (btemp * intensidade));
    delay(tempo);
  }
  //desce azul
  for (btemp = 1023; btemp > 0; btemp = btemp - 5)
  {
    setColor((rtemp * intensidade), (gtemp * intensidade), (btemp * intensidade));
    delay(tempo);
  }
  //sobe vermelho
  for (rtemp = 0; rtemp < 1023; rtemp = rtemp + 5)
  {
    setColor((rtemp * intensidade), (gtemp * intensidade), (btemp * intensidade));
    delay(tempo);
  }
  //desce verde
  for (gtemp = 1023; gtemp > 0; gtemp = gtemp - 5)
  {
    setColor((rtemp * intensidade), (gtemp * intensidade), (btemp * intensidade));
    delay(tempo);
  }
  //sobe azul
  for (btemp = 0; btemp < 1023; btemp = btemp + 5)
  {
    setColor((rtemp * intensidade), (gtemp * intensidade), (btemp * intensidade));
    delay(tempo);
  }
  //desce vermelho
  for (rtemp = 1023; rtemp > 0; rtemp = rtemp - 5)
  {
    setColor((rtemp * intensidade), (gtemp * intensidade), (btemp * intensidade));
    delay(tempo);
  }
}
