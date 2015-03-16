ulimit -n 2048

if [ -d $HOME/Dropbox ]; then
  export SAFE_DIR=$HOME/Dropbox
else
  export SAFE_DIR=$HOME
fi

# For tab completion
export FIGNORE=".o:~:Application Scripts"

# Java
if [ -d /Library/Java/JavaVirtualMachines/jdk1.8.0_25.jdk/Contents/Home ]; then
  export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk1.8.0_25.jdk/Contents/Home
elif [ -d /Library/Java/JavaVirtualMachines/1.6.0_31-b04-415.jdk/Contents/Home ]; then
  export JAVA_HOME=/Library/Java/JavaVirtualMachines/1.6.0_31-b04-415.jdk/Contents/Home
fi

# For AXI builds
export JAVA3_HOME=$JAVA_HOME
export JAVA4_HOME=$JAVA_HOME
export JAVA5_HOME=$JAVA_HOME
export JAVA6_HOME=$JAVA_HOME
export JBOSS_HOME=$HOME/jboss

# Gradle
export GRADLE_OPTS="-Xmx1024m -Xms256m -XX:MaxPermSize=512m -XX:+CMSClassUnloadingEnabled -XX:+HeapDumpOnOutOfMemoryError"

export EDITOR='mvim -f'
