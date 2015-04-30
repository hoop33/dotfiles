ulimit -n 2048

if [ -d $HOME/Dropbox ]; then
  export SAFE_DIR=$HOME/Dropbox
else
  export SAFE_DIR=$HOME
fi

# For tab completion
export FIGNORE=".o:~:Application Scripts"

# Java
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk1.8.0_25.jdk/Contents/Home

# For AXI builds
export JAVA3_HOME=/System/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Home
export JAVA4_HOME=/System/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Home
export JAVA5_HOME=/System/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Home
export JAVA6_HOME=/System/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Home
export JBOSS_HOME=$HOME/jboss
export JAVA_CRAP=/System/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Home

# Gradle
export GRADLE_OPTS="-Xmx1024m -Xms256m -XX:MaxPermSize=512m -XX:+CMSClassUnloadingEnabled -XX:+HeapDumpOnOutOfMemoryError"

export EDITOR='mvim -f'

export NVM_DIR=$HOME/.nvm
source $(brew --prefix nvm)/nvm.sh

# For building Lime
export PKG_CONFIG_PATH=$(brew --prefix python3)/Frameworks/Python.framework/Versions/3.4/lib/pkgconfig:$(brew --prefix qt5)/lib/pkgconfig

