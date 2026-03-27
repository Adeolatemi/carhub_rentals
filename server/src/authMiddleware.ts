// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";

// interface JwtPayload {
//   id: string;
//   role: string;
// }

// export function requireAuth(req: Request, res: Response, next: NextFunction) {
//   const authHeader = req.headers.authorization;
//   if (!authHeader) return res.status(401).json({ error: "No token provided" });

//   const token = authHeader.split(" ")[1];
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
//     (req as any).user = decoded; // attach user info to request
//     next();
//   } catch (err) {
//     return res.status(401).json({ error: "Invalid token" });
//   }
// }

// export function requireAdmin(req: Request, res: Response, next: NextFunction) {
//   requireAuth(req, res, () => {
//     const user = (req as any).user;
//     if (user.role !== "ADMIN") {
//       return res.status(403).json({ error: "Forbidden: Admins only" });
//     }
//     next();
//   });
// }
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

interface JwtPayload {
  id: string;
  role: string;
}

// Attach user info to request if token is valid
export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = decoded; // properly typed
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

// Only allow ADMIN users
export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  requireAuth(req, res, () => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Forbidden: Admins only" });
    }
    next();
  });
}