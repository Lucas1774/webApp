#!/bin/bash
# Compiles into a server.jar file using prod profile
sed -i 's/active: .*/active: prod/' src/main/resources/application.yml
./mvnw.cmd clean package
if [ -f "server.jar" ]; then
    rm -f server.jar
fi
mv -f target/server-0.0.1-SNAPSHOT.jar server.jar
sed -i 's/active: .*/active: dev/' src/main/resources/application.yml
echo "Press any key to continue."
read -n 1
