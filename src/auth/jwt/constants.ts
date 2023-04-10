//doto use configService to bring from .env
export const jwtAccessConstant = {
  secret: 'your-secret-key', 
  exp : '15m'
};

export const refreshjwtConstants = {
  secret: 'your-refresh-secret-key', 
  exp : '7d'
};