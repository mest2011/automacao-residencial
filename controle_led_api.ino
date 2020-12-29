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

void setup()
{
  pinMode(BLUE, OUTPUT);

  digitalWrite(BLUE, LOW);

  Serial.begin(115200);
  Serial.write(12);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED)
  {
    error("Connectando ao WIFI...");
  }
}

void loop()
{

  if (WiFi.status() == WL_CONNECTED)
  {
    HTTPClient http; //Object of class HTTPClient
    http.begin("http://api.mesttech.com.br/iot/?name=rgb&status=status");
    int httpCode = http.GET();

    if (httpCode > 0)
    {
      const size_t bufferSize = JSON_OBJECT_SIZE(2) + JSON_OBJECT_SIZE(3) + JSON_OBJECT_SIZE(5) + JSON_OBJECT_SIZE(8) + 370;
      DynamicJsonBuffer jsonBuffer(bufferSize);
      JsonObject &root = jsonBuffer.parseObject(http.getString());

      int id = (int)root["id_lampada"];
      int state = (int)root["status"];
      const char *name = root["nome"];
      int tempo = (int)root["tempo"];
      const char *funcao = root["funcao"];
      const char *cor = root["cor"];
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
      Serial.print("Cor em HEX: ");
      Serial.println(cor);
      Serial.println("Cor em RGB: ");
      Serial.print("Red: ");
      Serial.println(r);
      Serial.print("Green: ");
      Serial.println(g);
      Serial.print("Blue: ");
      Serial.println(b);

      if (state == 0)
      {
        changeState(state);
        delay(5000);
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
        }
      }
    }
    else
    {
      error("Erro na requisição dos dados da API!");
    }
    http.end(); //Close connection
  }
  else
  {
    error("Connectando ao WIFI...");
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

//------------Efeitos-------------

void error(String msg)
{
  Serial.println(msg);
  r = 1023;
  g = 0;
  b = 0;
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
  int rtemp = r;
  int gtemp = g;
  int btemp = b;
  for (int i = 0; i < 1024; i++)
  {
    if (rtemp <= 1 && gtemp <= 1 && btemp <= 1)
    {
      break;
    }

    setColor(rtemp, gtemp, btemp);
    delay(tempo / 10);
    rtemp--;
    gtemp--;
    btemp--;
  }
  for (int i = 1024; i > 0; i--)
  {
    if (rtemp >= r || gtemp >= g || btemp >= b)
    {
      break;
    }
    setColor(rtemp, gtemp, btemp);
    delay(tempo / 10);
    rtemp++;
    gtemp++;
    btemp++;
  }
}

void carrossel(int tempo)
{

  int rtemp = 0;
  int gtemp = 0;
  int btemp = 1023;
  //sobe verde
  for (gtemp = 0; gtemp < 1023; gtemp = gtemp + 5)
  {
    setColor(rtemp, gtemp, btemp);
    delay(tempo);
  }
  //desce azul
  for (btemp = 1023; btemp > 0; btemp = btemp - 5)
  {
    setColor(rtemp, gtemp, btemp);
    delay(tempo);
  }
  //sobe vermelho
  for (rtemp = 0; rtemp < 1023; rtemp = rtemp + 5)
  {
    setColor(rtemp, gtemp, btemp);
    delay(tempo);
  }
  //desce verde
  for (gtemp = 1023; gtemp > 0; gtemp = gtemp - 5)
  {
    setColor(rtemp, gtemp, btemp);
    delay(tempo);
  }
  //sobe azul
  for (btemp = 0; btemp < 1023; btemp = btemp + 5)
  {
    setColor(rtemp, gtemp, btemp);
    delay(tempo);
  }
  //desce vermelho
  for (rtemp = 1023; rtemp > 0; rtemp = rtemp - 5)
  {
    setColor(rtemp, gtemp, btemp);
    delay(tempo);
  }
}
