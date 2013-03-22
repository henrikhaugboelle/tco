#include <QueueList.h>

QueueList <int> que;

void setup(){
  Serial.begin(9600);
}

void loop(){
  while(Serial.available() > 0)
  {
    int input = Serial.read();
    if(input == 126){
      echo();
    }
    else{
      if(input == 125){
        int escaped = Serial.read(); //Ligger der noget i bufferen?
        if(escaped == 93){
         que.push(125);
        }
        else if(escaped == 94){
         que.push(126);
        }
      }
      else{
        que.push(input);
      }
    }
  }
}

void echo(){
  while (!que.isEmpty ()){
    Serial.write (que.pop ());
  }
  Serial.write(126);
}
