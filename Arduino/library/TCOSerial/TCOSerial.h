/*
 *  TCOSerial.h
 */

// header defining the interface of the source.
#ifndef _TCOSerial_H
#define _TCOSerial_H

#include <Arduino.h>
#include <QueueList.h>

class TCOSerial {
  public:
    TCOSerial();
    void begin();
	QueueList <int> *readSerial();
    void writeSerial(QueueList <int> &outQueue);
  private:
    QueueList <int> inQueue;
    boolean nextEscaped;
    int ESCAPE;
    int BOUNDARY;
    int ESCAPEINV;
    int BOUNDARYINV;
};

TCOSerial::TCOSerial() {
}

void TCOSerial::begin() {
    Serial.begin(9600);
    nextEscaped = false;
    ESCAPE = 125;
    BOUNDARY = 126;
    ESCAPEINV = 93;
    BOUNDARYINV = 94;
}

// Returns true if the queue contains a complete message
// Remember to empty the queue!!!
QueueList <int> *TCOSerial::readSerial(){
  while(Serial.available() > 0)
  {
    int input = Serial.read();
    if (nextEscaped){
      if(input == ESCAPEINV){
        inQueue.push(ESCAPE);
      }
      else if(input == BOUNDARYINV){
       inQueue.push(BOUNDARY);
      }
      // could be that input is not 93 or 94, which is an error
      nextEscaped = false;
    }
    else if(input == ESCAPE){
      nextEscaped = true;
    }
    else if(input == BOUNDARY){
      return &inQueue;
    }
    else{
      inQueue.push(input);
    }
  }
  return NULL;
}

void TCOSerial::writeSerial(QueueList <int> &outQueue){
  while (!outQueue.isEmpty ()){
    int character = outQueue.pop();
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
#endif // _QUEUELIST_H
