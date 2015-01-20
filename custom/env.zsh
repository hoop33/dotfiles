ulimit -n 2048

export SAFE_DIR=~/Dropbox

# For tab completion
export FIGNORE=".o:~:Application Scripts"

# For using DiffFork for git diff
export GIT_EXTERNAL_DIFF=~/bin/gitdfdiff.sh

# Java
if [ -d /Library/Java/JavaVirtualMachines/jdk1.8.0_25.jdk/Contents/Home ]; then
  export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk1.8.0_25.jdk/Contents/Home
elif [ -d /Library/Java/JavaVirtualMachines/1.6.0_31-b04-415.jdk/Contents/Home ]; then
  export JAVA_HOME=/Library/Java/JavaVirtualMachines/1.6.0_31-b04-415.jdk/Contents/Home
fi

# Gradle
export GRADLE_OPTS="-Xmx1024m -Xms256m -XX:MaxPermSize=512m -XX:+CMSClassUnloadingEnabled -XX:+HeapDumpOnOutOfMemoryError"

