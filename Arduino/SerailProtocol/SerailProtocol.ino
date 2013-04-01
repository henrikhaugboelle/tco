#include <QueueList.h>
#include <TCOSerial.h>

QueueList <int> outQueue;
TCOSerial tcoSerial;
int timer = 0;
const int groundPin = 8;
const int powerPin = 9;
const int xPin = A1;
const int yPin = A2;
const int zPin = A3;
const int ledPin = 10;

void setup(){
  tcoSerial.begin();
  pinMode(groundPin, OUTPUT);
  pinMode(powerPin, OUTPUT);
  pinMode(ledPin, OUTPUT);
  digitalWrite(groundPin, LOW); 
  digitalWrite(powerPin, HIGH);
}

void echo(){
  tcoSerial.writeSerial(outQueue);
}

void loop(){
  QueueList <int> *inQueuePtr = tcoSerial.readSerial();
  if(inQueuePtr){
    // set global state
    QueueList <int> inQueue = *inQueuePtr;
    while (!(inQueue.isEmpty())){ // TODO: Write logic for signals
      analogWrite(ledPin, inQueue.pop());
    }
  }
  //if(timer > 10000){ original value
  if(timer > 20000){
    int x = analogRead(xPin);
    int y = analogRead(yPin);
    int z = analogRead(zPin);
    outQueue.push(x);
    outQueue.push(y);
    outQueue.push(z);
    tcoSerial.writeSerial(outQueue);
    timer = 0;
  }
  timer++;
}


