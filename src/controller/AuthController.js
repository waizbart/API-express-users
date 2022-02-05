const Sequelize = require("sequelize");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authConfig = require("../config/auth");

module.exports = {
  async store(req, res) {
    const { login, senha } = req.body;

    try {
      const userExist = await User.findOne({
        where: Sequelize.or({ email: login }, { cpf: login }),
      });
      if (!userExist) {
        return res.status(401).json({ error: "Usuário não encontrado" });
      }
      if (!userExist.acesso === 1) {
        return res.status(401).json({ error: "Usuário desativado" });
      }
      if (!(await userExist.checkPassword(senha))) {
        return res.status(401).json({ error: "Senha não é valida" });
      }
      const { id, nome, email, cpf, acesso, nivel } = userExist;

      return res.json({
        user: {
          id,
          nome,
          email,
          cpf,
          acesso,
          nivel,
        },
        token: jwt.sign(
          {
            id,
            nome,
            email,
            cpf,
            acesso,
            nivel,
          },
          authConfig.secret,
          {
            expiresIn: authConfig.expiresIn,
          }
        ),
      });
    } catch (err) {
        return res.json({ error: 'Ops... Ocorreu um erro' })
    }
  },
};
