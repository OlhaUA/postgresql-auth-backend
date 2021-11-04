const environment = {
  port: parseInt(process.env.PORT) || 8080,
  nodeEnv: process.env.NODE_ENV || 'production',
  saltRounds: parseInt(process.env.SALT_ROUNDS) || 10,
  jwtAccessTokenSecret:
    process.env.JWT_ACCESS_TOKEN_SECRET ||
    '68ac5ac503cad863fdb9ace4ae1df6e492948b363883caeaf41385c0c61c3f175b0a7596ce050be11d8924d074b73e995d39031bef39ee9c72239e74f9bd04c4',
  jwtRefreshTokenSecret:
    process.env.JWT_REFRESH_TOKEN_SECRET ||
    '6aa98dd203c646e80163dc2f30c2f0b8795ec9d0852c2152d931154bc2636b5995b9188325a0b7361120017d84356c83281000466253766784d50592ad970252',
};

export default environment;
