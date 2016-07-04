# redux-oauth

Based on [Redux-Auth](https://github.com/lynndylanhurley/redux-auth)

* Dropped e-mail support, only omniauth logic left
* Dropped multiple endpoint support
* Dropped TokenBridge logic as we are using redux initial state anyway
* Dropped all unused code
* Dropped all shortcuts found in the code
* Dropped default and material-ui themes, dropped all modals

* Implemented isomorphic fetch
* extend -> lodash.assign
* Code styling, es6
* Extracted ButtonLoader to separate package