#include <QueueList.h>

QueueList <int> que;
boolean nextEscaped;
int ESCAPE;
int BOUNDARY;
int ESCAPEINV;
int BOUNDARYINV ;


void setup(){
  ESCAPE = 125;
  BOUNDARY = 126;
  ESCAPEINV = 93;
  BOUNDARYINV = 94;
  nextEscaped = false; 
  Serial.begin(9600);
}

void loop(){
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
      echo();
    }
    else{
      que.push(input);
    }
  }
}

void echo(){
  while (!que.isEmpty ()){
    Serial.write (que.pop ());
  }
  Serial.write(BOUNDARY);
}
