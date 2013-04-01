/*
 *  TCOSerial.h
 */

#ifndef _TCOSerial_H
#define _TCOSerial_H

#define _readSize  8
#define _writeSize  8

#include <Arduino.h>

class TCOSerial {
  public:
    TCOSerial();
    void begin();
	boolean readSerial();
    void writeSerial(int writeQueue[], int size);
	void resetRead();
	int readSize;
	int writeSize;
	int readQueue[_readSize];
	int readIndex;
  private:
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
	readSize = _readSize;
    writeSize = _writeSize;
    readIndex = 0;
	nextEscaped = false;
    ESCAPE = 125;
    BOUNDARY = 126;
    ESCAPEINV = 93;
    BOUNDARYINV = 94;
}

// Returns true if the queue contains a complete message
// Remember to empty the queue!!!
boolean TCOSerial::readSerial(){
  while(Serial.available() > 0)
  {
    int input = Serial.read();
    if (nextEscaped){
      if(input == ESCAPEINV){
        readQueue[readIndex++] = ESCAPE;
      }
      else if(input == BOUNDARYINV){
        readQueue[readIndex++] = BOUNDARY;
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
      readQueue[readIndex++] = input;
    }
  }
  return false;
}

void TCOSerial::writeSerial(int writeQueue[], int size){
  int i = 0;
  while (i < size){
    int character = writeQueue[i++];
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

void TCOSerial::resetRead(){
  readIndex = 0;
}
#endif
