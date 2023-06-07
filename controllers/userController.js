const bcrypt = require("bcrypt");
const prisma = require("../prisma");

// create user
exports.CreateUser = async (req, res) => {
  try {
    if (req.user.role === "User") {
      return res.status(403).json({ error: "Access denied" });
    }

    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(String(password), 10);

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    if (req.user.role === "Admin") {
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role,
          verified: true,
          verificationToken: null,
        },
      });

      res
        .status(201)
        .json({ message: "User created successfully", user: newUser });
    } else if (req.user.role === "Support" && role === "User") {
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role,
          verified: true,
          verificationToken: null,
        },
      });

      res
        .status(201)
        .json({ message: "User created successfully", user: newUser });
    } else {
      res
        .status(403)
        .json({ error: `You can't create user with "${role}" role` });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

//  get all users
exports.GetUsers = async (req, res) => {
  try {
    if (req.user.role !== "User") {
      const users = await prisma.user.findMany({
        where: {
          ...(req.user.role === "Support"
            ? {
                role: "User",
              }
            : {}),
        },
      });

      res.json({
        data: users,
      });
    } else {
      res.status(403).json({ error: "Access denied" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// get a specific user by id
exports.GetUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (req.user.role === "Admin") {
      res.json(user);
    } else if (req.user.role === "Support" && user.role === "User") {
      res.json(user);
    } else if (req.user.role === "User" && user.role === "User") {
      res.json(user);
    } else {
      res.status(403).json({ error: "Access denied" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// update user by id
exports.UpdateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(String(password), 10);
    }

    delete req.body.password;

    if (req.user.role === "Admin") {
      const updatedUser = await prisma.user.update({
        where: {
          id,
        },
        data: {
          name,
          email,
          ...(password
            ? {
                password: hashedPassword,
              }
            : {}),
          ...req.body,
        },
      });

      return res.json({
        message: "User updated successfully",
        user: updatedUser,
      });
    }

    // getting the user to update
    const userToUpdate = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!userToDelete) {
      return res.status(500).json({ error: "User not found" });
    }

    if (req.user.role === "Support" && userToUpdate.role === "User") {
      const updatedUser = await prisma.user.update({
        where: {
          id,
        },
        data: {
          name,
          email,
          ...(password
            ? {
                password: hashedPassword,
              }
            : {}),
        },
      });

      res.json({ message: "User updated successfully", user: updatedUser });
    } else if (
      req.user.role === "User" &&
      userToUpdate.role === "User" &&
      id === req.user.id
    ) {
      const updatedUser = await prisma.user.update({
        where: {
          id,
        },
        data: {
          name,
          email,
          ...(password
            ? {
                password: hashedPassword,
              }
            : {}),
        },
      });

      res.json({ message: "User updated successfully", user: updatedUser });
    } else {
      res.status(403).json({ error: "Access denied" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// delete user by id
exports.DeleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // getting the user to update
    const userToDelete = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!userToDelete) {
      return res.status(500).json({ error: "User not found" });
    }

    if (req.user.role === "Admin") {
      await prisma.user.delete({
        where: {
          id,
        },
      });

      res.json({ message: "User deleted successfully" });
    } else if (req.user.role === "Support" && userToDelete.role === "User") {
      await prisma.user.delete({
        where: {
          id,
        },
      });

      res.json({ message: "User deleted successfully" });
    } else if (
      req.user.role === "User" &&
      userToDelete.role === "User" &&
      id === req.user.id
    ) {
      await prisma.user.delete({
        where: {
          id,
        },
      });

      res.json({ message: "User deleted successfully" });
    } else {
      res.status(403).json({ error: "Access denied" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
