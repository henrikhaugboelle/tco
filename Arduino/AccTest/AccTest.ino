const int groundPin = 8;
const int powerPin = 9;
const int xPin = A1;
const int yPin = A2;
const int zPin = A3;
const int ledPin = 10;

void setup(){
  Serial.begin(9600);
  pinMode(groundPin, OUTPUT);
  pinMode(powerPin, OUTPUT);
  pinMode(ledPin, OUTPUT);
  digitalWrite(groundPin, LOW); 
  digitalWrite(powerPin, HIGH);
}

void loop(){
  Serial.print('-');
  Serial.print(analogRead(xPin));
  delay(500);
  //byte y = analogRead(yPin) / 4;
    //byte z = analogRead(zPin) / 4;
}


