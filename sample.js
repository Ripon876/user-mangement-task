const bcrypt = require("bcrypt");
const prisma = require("./prisma");

exports.CreateSampleUsers = async () => {
  const hashedPassword = await bcrypt.hash(String(123), 10);
  console.log("Creating Admin");
  const admin = await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: "Admin",
      verified: true,
      verificationToken: null,
    },
  });
  console.log("Creating Support");
  const support = await prisma.user.create({
    data: {
      name: "Support",
      email: "support@gmail.com",
      password: hashedPassword,
      role: "Support",
      verified: true,
      verificationToken: null,
    },
  });
  console.log("Creating User");
  const user = await prisma.user.create({
    data: {
      name: "User",
      email: "user@gmail.com",
      password: hashedPassword,
      role: "User",
      verified: true,
      verificationToken: null,
    },
  });
  const users = await prisma.user.findMany();
  console.log(users);
};
