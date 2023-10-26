#!/bin/sh
set -e

# Function to replace environment variables in the main.*.js file
replace_env_variables() {
  for var in $(printenv | grep "^REACT_APP_" | awk -F "=" '{print $1}')
  do
    # If the environment variable is not set, use a default value
    eval "value=\${$var:-default_value}"
    sed -i "s|\${$var}|${value}|g" /app/build/static/js/main.*.js
  done
}

# Check if there are any environment variables to replace
if printenv | grep -q "^REACT_APP_"; then
  echo "Replacing environment variables in main.*.js..."
  replace_env_variables
  echo "Environment variables replaced successfully."
else
  echo "No environment variables found starting with REACT_APP_"
fi

# Start the server
http-server /app/build -p 80
