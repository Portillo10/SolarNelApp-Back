import {request, response} from 'express'

export const renewSession = async (req = request, res = response) => {
  res.status(200).json({msg:"Renovado con éxito"})
}