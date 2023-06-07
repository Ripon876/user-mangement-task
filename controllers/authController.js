const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const prisma = require("../prisma");
const Mailer = require("../configs/mail");

exports.SignUpUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }
    const hashedPassword = await bcrypt.hash(String(password), 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        verificationToken: uuidv4(),
      },
    });

    const verificationLink = `${process.env.BACKEND_BASE_URL}/verify/${newUser.verificationToken}`;

    await Mailer.sendMail({
      from: "islam876ripon@gmail.com",
      to: email,
      subject: "Email Verification",
      text: `Click the following link to verify your email: ${verificationLink}`,
      html: `<p>Click the following link to verify your email: <a href="${verificationLink}">${verificationLink}</a></p>`,
    });

    res.status(201).json({
      message:
        "User created successfully. Please click on the link sent to your email to verify your email",
      user: newUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.VerifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await prisma.user.findUnique({
      where: {
        verificationToken: token,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "Invalid verification token" });
    }
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        verified: true,
        verificationToken: null,
      },
    });

    res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.LoginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: "Email is not registered" });
    }

    const passwordMatched = await bcrypt.compare(
      String(password),
      user.password
    );
    if (!passwordMatched) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    if (user.verificationToken) {
      return res.status(401).json({
        error:
          "Verify your account first. Click on the link sent to your email",
      });
    }

    req.session.isAuthenticated = true;
    req.session.user = {
      id: user.id,
      name: user.name,
      role: user.role,
    };
    delete user.password;

    res.status(200).json({ message: "Login successful", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.LogOutUser = (req, res) => {
  req.session.destroy();
  res.json({ message: "Logout successful" });
};
