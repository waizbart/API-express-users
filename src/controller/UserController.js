const User = require("../models/User");
const bcrypt = require("bcrypt");
const Sequelize = require("sequelize");

module.exports = {
  async index(req, res) {
    try {
      if (req.user.nivel === 999 && req.user.acesso === 1) {
        const users = await User.findAll();
        return res.json(users);
      }
      return res.status(401).json({ error: "Você não tem autorização" });
    } catch (err) {
      return res
        .status(401)
        .json({ error: "Não foi possível mostrar os usuários" });
    }
  },
  async store(req, res) {
    try {
      const data = req.body;
      const userExist = await User.findOne({
        where: Sequelize.or({ email: data.email }, { cpf: data.cpf }),
      });
      if(userExist){
          if(userExist.email === data.email){
              return res.status(400).json({ error: "Email já cadastrado" })
          }
          return res.status(400).json({ error: "CPF já cadastrado" })
      }
      const user = await User.create(data);
      return res.json(user);
    } catch (err) {
      return res
        .status(401)
        .json({ error: "Não foi possível criar o usuário" });
    }
  },
  async update(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;

      if (data.senha) {
        data.senha = await bcrypt.hash(client.senha, 8);
      }

      const user = await User.update(data, {
        where: { id },
      });

      return res.json({ message: "Atualizado com sucesso" });
    } catch (err) {
      return res
        .status(401)
        .json({ error: "Não foi possível atualizar o usuário" });
    }
  },
  async destroy(req, res) {
    try {
      const { id } = req.params;
      const user = await User.destroy({
        where: { id },
      });
      return res.json({ message: "Deletado com sucesso" });
    } catch (error) {
      return res
        .status(401)
        .json({ error: "Não foi possível deletar o usuários" });
    }
  },
};
