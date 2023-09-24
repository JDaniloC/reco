import mongoose from "mongoose";

export interface RegrasProposta {
  mesesAtraso: number;
  melhorEntrada?: number;
  melhorParcela: number;
  piorParcela: number;
  piorEntrada?: number;
}

export interface Usuario {
  nome: string;
  email: string;
  password: string;
  regrasProposta: RegrasProposta[];
}

const UsuarioSchema = new mongoose.Schema({
  nome: String,
  email: String,
  password: String,
  regrasProposta: [
    {
      mesesAtraso: Number,
      melhorEntrada: {
        type: Number,
        required: false,
        default: 0,
      },
      melhorParcela: Number,
      piorParcela: Number,
      piorEntrada: {
        type: Number,
        required: false,
        default: 0
      },
    },
  ],
});

export default mongoose.models.Usuarios ||
  mongoose.model("Usuarios", UsuarioSchema);
