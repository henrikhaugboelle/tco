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
    void writeSerial(byte writeQueue[], byte size);
	void resetRead();
	byte readSize;
	byte writeSize;
	byte readQueue[_readSize];
	byte inCommingMessageSize;
  private:
    boolean nextEscaped;
    byte ESCAPE;
    byte BOUNDARY;
    byte ESCAPEINV;
    byte BOUNDARYINV;
};

TCOSerial::TCOSerial() {
}

void TCOSerial::begin() {
    Serial.begin(9600);
	readSize = _readSize;
    writeSize = _writeSize;
    inCommingMessageSize = 0;
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
    byte input = Serial.read();
    if (nextEscaped){
      if(input == ESCAPEINV){
        readQueue[inCommingMessageSize++] = ESCAPE;
      }
      else if(input == BOUNDARYINV){
        readQueue[inCommingMessageSize++] = BOUNDARY;
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
      readQueue[inCommingMessageSize++] = input;
    }
  }
  return false;
}

void TCOSerial::writeSerial(byte writeQueue[], byte size){
  byte i = 0;
  while (i < size){
    byte character = writeQueue[i++];
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
  inCommingMessageSize = 0;
}
#endif
