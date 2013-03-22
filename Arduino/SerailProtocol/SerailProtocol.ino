#include <QueueList.h>

QueueList <int> que;
boolean nextEscaped = false;
int ESCAPE = 125;
int BOUNDARY = 126;
int ESCAPEINV = 93;
int BOUNDARYINV = 94;
int timer = 0;
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

// Returns true if the queue contains a complete message
// Remember to empty the queue!!!
boolean readSerial(){
  while(Serial.available() > 0)
  {
    int input = Serial.read();
    if (nextEscaped){
      if(input == ESCAPEINV){
        que.push(ESCAPE);
      }
      else if(input == BOUNDARYINV){
       que.push(BOUNDARY);
      }
      // could be that input is not 93 or 94, which is an error
      nextEscaped = false;
    }
    else if(input == ESCAPE){
      nextEscaped = true;
    }
    else if(input == BOUNDARY){
      return true;
    }
    else{
      que.push(input);
    }
  }
  return false;
}

void writeSerial(QueueList <int> message){
  while (!message.isEmpty ()){
    int character = message.pop();
    if(character == ESCAPE){
      Serial.write(ESCAPE);
      Serial.write(ESCAPEINV);
    }
    else if(character == BOUNDARY){
      Serial.write(ESCAPE);
      Serial.write(BOUNDARYINV);
    }
    else{
      Serial.write(character);
    }
  }
  Serial.write(BOUNDARY);
}

void echo(){
  writeSerial(que);
}

void loop(){
  if(readSerial()){
    // set global state
    while (!que.isEmpty ()){ ////////////////77
      analogWrite(ledPin, que.pop()); /////////////77
    }
  }
  if(timer > 10000){
    QueueList <int> message;
    int x = analogRead(xPin);
    int y = analogRead(yPin);
    int z = analogRead(zPin);
    message.push(x);
    writeSerial(message);
    timer = 0;
  }
  timer++;
}

