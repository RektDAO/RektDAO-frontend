export CI=
export REACT_APP_NAME="RektDAO"

if [[ "$TRAVIS_BRANCH" == "RektDAO/main" ]]; then
  export REACT_APP_URL_APP="https://app.rektdao.finance"
elif [[ "$TRAVIS_BRANCH" == "RektDAO/develop" ]]; then
  export REACT_APP_NAME="RektDAO DEV"
  export REACT_APP_URL_APP="https://dev.rektdao.finance"
else
  export REACT_APP_NAME="RektDAO LOCAL"
  export REACT_APP_URL_APP="http://localhost:3000"
fi
