declare namespace Express {
  interface Request {
    usuarioAutenticado?: {
      id?: number;
      email?: string;
      nome?: string;
    };
  }
}
