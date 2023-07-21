import { sequelize } from "./database/database.js";
import { Op } from "sequelize";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import {University} from "./models/University.js";
import {Career} from "./models/Career.js";
import {Course} from "./models/Course.js";
import {User} from "./models/User.js";
import {Student} from "./models/Student.js";
import {Teacher} from "./models/Teacher.js";
import {Schedule} from "./models/Schedule.js";
import {Advisory} from "./models/Advisory.js";

const app = express();
const port = process.env.PORT || 3001;

// Configurar body-parser para analizar el cuerpo de las solicitudes como JSON
app.use(bodyParser.json());
app.use(cors());

async function connectDB() {
    try {
        await sequelize.authenticate();
        console.log("Successfully connected to database");
        await sequelize.sync({ force: true });
    } catch (e) {
        console.error("Error: ", e);
    }
}

app.post("/universities", async (req, res) => {
   try {
       const body = req.body;
       const created = await University.create({
           name: body.name
       });
       res.json(created);
   } catch (error) {
       console.error(`Error creating university: ${error}`);
       res.status(500).json({ message: "Internal server error"});
   }
});

app.post("/career", async (req, res) => {
    try {
        const body = req.body;
        const created = await Career.create({
            name: body.name
        });
        res.json(created);
    } catch (error) {
        console.error(`Error creating career: ${error}`);
        res.status(500).json({ message: "Internal server error"});
    }
})

app.post("/course", async (req, res) => {
    try {
        const body = req.body;
        const created = await Course.create({
            name: body.name,
            description: body.description ? body.description : ""
        });
        res.json(created);
    } catch (error) {
        console.error(`Error creating course: ${error}`);
        res.status(500).json({ message: "Internal server error"});
    }
})

app.get("/universities", async (req, res) => {
    try {
        const date = new Date();
        const universities = await University.findAll();
        res.json(universities);
    } catch (error) {
        console.error(`Error getting universities: ${error}`);
        res.status(500).json({ message: "Internal server error"});
    }
})

app.get("/teacher/:teacherId/schedule/list", async (req, res) => {
    try {
        const teacherId = req.params.teacherId;
        const showAvailability = req.query.showAvailability ? req.query.showAvailability : false;

        let response = [];

        const schedules = await Schedule.findAll({
            where: {
                user_id: parseInt(teacherId),
            }
        })

        if (showAvailability) {
            const date = new Date();
            for (const schedule of schedules) {
                const advisory = await Advisory.findAll({
                    where: {
                        teacher_id: teacherId,
                        date_timestamp: {
                            [Op.lt]: date.getTime()
                        }
                    }
                })

                if (advisory.length > 2) {
                    response.push({
                        day: schedule.day,
                        initHour: schedule.initHour,
                        endHour: schedule.endHour,
                        link: schedule.link,
                        available: false
                    })
                } else {
                    response.push({
                        day: schedule.day,
                        initHour: schedule.initHour,
                        endHour: schedule.endHour,
                        link: schedule.link,
                        available: true
                    })
                }
            }
        } else {
            response = schedules;
        }
        res.json(response);
    } catch (error) {
        console.error("Error general:", error);
        res.status(500).json({ error: "Ha ocurrido un error en el servidor" });
    }
});

app.post("/teacher/:teacherId/schedule", async (req, res) => {
    const teacherId = req.params.teacherId;
    const body = req.body;

    const scheduleCreated = await Schedule.create({
        day: body.day,
        initHour: body.initHour,
        endHour: body.endHour,
        link: body.link,
        user_id: teacherId,
    });

    res.status(201).json(scheduleCreated);
});

app.delete("/teacher/:teacherId/schedule/:scheduleId", async (req, res) => {
    const teacherId = req.params.teacherId;
    const scheduleId = req.params.scheduleId;

    await Schedule.destroy({
       where: {
           id: scheduleId,
           user_id: teacherId
       }
    })

    res.json({ message: "ok" })
});

app.get("/teachers", async (req, res) => {
    try {
        const queryParams = req.query;

        const response = [];

        const filters = {}

        if (queryParams.university) {
            filters.university = queryParams.university;
        }

        if (queryParams.course) {
            filters.course = queryParams.course;
        }

        if (queryParams.name) {
            filters.full_name = {
                [Op.like]: `%${queryParams.name}%`
            }
        }

        const teachers = await Teacher.findAll({
            where: filters
        });

        for (const teacher of teachers) {
            const user = await User.findOne({
                where: {
                    id: teacher.user_id
                }
            });

            response.push({
                name: user.name,
                lastname: user.lastname,
                grade: teacher.grade,
                profession: teacher.profession,
                presentation: teacher.presentation,
                university: teacher.university,
                course: teacher.course,
                user_id: user.id
            });
        }
        res.json(response);
    } catch (error) {
        console.error(`Error getting universities: ${error}`);
        res.status(500).json({ message: "Internal server error"});
    }
})

app.get("/teacher/:id", async (req, res) => {
    const teacherId = req.params.id;

    const user = await User.findOne({
        where: {
            id: teacherId
        }
    })

    const teacher = await Teacher.findOne({
        where: {
            user_id: teacherId
        }
    })

    const response = {
        name: user.name,
        lastname: user.lastname,
        type: user.type,
        full_name: teacher.full_name,
        grade: teacher.grade,
        profession: teacher.profession,
        presentation: teacher.presentation,
        university: teacher.university,
        course: teacher.course,
        user_id: teacher.user_id
    }
    res.json(response);
})

app.post("/advisory", async (req, res) => {
    try {
        const body = req.body;
        console.log(body);

        const advisoryCreated = await Advisory.create({
            teacher_id: body.teacher_id,
            teacher_name: body.teacher_name,
            student_id: body.student_id,
            student_name: body.student_name,
            date_timestamp: body.date_timestamp,
            link: body.link,
        });

        res.status(201).json(advisoryCreated);
    } catch (error) {
        console.error("Error al crear el asesoramiento:", error);
        res.status(500).json({ error: "Error al crear el asesoramiento" });
    }
});

app.get("/advisories/:id", async (req, res) => {
    const query = req.query;
    const type = query.type ? query.type : "student"
    const id = req.params.id;

    const filters = {};

    if (query.creationDateFrom) {
        filters.date_timestamp = {
            [Op.gte]: parseInt(query.creationDateFrom)
        }
    }

    if (query.creationDateTo) {
        filters.date_timestamp = {
            [Op.lte]: parseInt(query.creationDateTo)
        }
    }

    if (type === "student") {
        filters.student_id = parseInt(id);
    } else {
        filters.teacher_id = parseInt(id);
    }

    console.log(filters);

    const advisories = await Advisory.findAll({
        where: filters
    })

    const response = []

    for (const advisory of advisories) {
        response.push({
            id: advisory.id,
            teacher_id: advisory.teacher_id,
            teacher_name: advisory.teacher_name,
            student_id: advisory.student_id,
            student_name: advisory.student_name,
            date_timestamp: advisory.date_timestamp,
            link: advisory.link
        })
    }
    res.json(response);
})

app.get("/get_initial_config", async (req, res) => {
    try {
        const universities = await University.findAll();
        const careers = await Career.findAll();
        const courses = await Course.findAll();
        res.json({
            universities,
            careers,
            courses
        });
    } catch (error) {
        console.error(`Error getting universities: ${error}`);
        res.status(500).json({ message: "Internal server error"});
    }
});

app.post("/login", async (req, res) => {
    const body = req.body;

    const user = await User.findOne({
        where: {
            user: body.user,
            password: body.password,
        }
    });

    let response = {};

    if (user) {
        response = {
            name: user.name,
            lastname: user.lastname,
            dni: user.dni,
            user: user.user,
            password: user.password,
            type: user.type
        }
        if (user.type === "student") {
            const student = await Student.findOne({
                where: {
                    user_id: user.id
                }
            })
            response.university = student.university;
            response.career = student.career;
            response.user_id = user.id;
        } else if(user.type === "teacher") {
            const teacher = await Teacher.findOne({
                where: {
                    user_id: user.id
                }
            })
            response.grade = teacher.grade;
            response.profession = teacher.profession;
            response.presentation = teacher.presentation;
            response.university = teacher.university;
            response.course = teacher.course;
            response.user_id = user.id;
        }
    } else {
        res.status(404).json({ message: "No existe el usuario o contraseña"})
        return;
    }
    res.json(response);
})

app.post("/user", async (req, res) => {
    const body = req.body;
    let userCreated = {};

    if (body.type === "student") {
        const created = await User.create({
            name: body.name,
            lastname: body.lastname,
            dni: body.dni,
            user: body.user,
            password: body.password,
            type: body.type,
        })

        const studentCreated = await Student.create({
            full_name: `${body.name} ${body.lastname}`,
            university: body.university,
            career: body.career,
            user_id: created.id,
        });

        userCreated = {
            name: created.name,
            lastname: created.lastname,
            dni: created.dni,
            user: created.user,
            university: studentCreated.university,
            career: studentCreated.career,
            user_id: studentCreated.user_id
        }
    } else if (body.type === "teacher") {
        const created = await User.create({
            name: body.name,
            lastname: body.lastname,
            dni: body.dni,
            user: body.user,
            password: body.password,
            type: body.type,
        })

        const teacherCreated = await Teacher.create({
            full_name: `${body.name} ${body.lastname}`,
            grade: body.grade,
            profession: body.profession,
            presentation: body.presentation,
            university: body.university,
            course: body.course,
            user_id: created.id
        })

        userCreated = {
            name: created.name,
            lastname: created.lastname,
            dni: created.dni,
            user: created.user,
            grade: teacherCreated.grade,
            profession: teacherCreated.profession,
            presentation: teacherCreated.presentation,
            university: teacherCreated.university,
            course: teacherCreated.course,
            user_id: teacherCreated.user_id
        }
    }
    userCreated.type = body.type;
    userCreated.password = body.password;
    res.status(201).json(userCreated);
})

app.listen(port, function() {
    console.log(`Server running on port ${port}...`);
    connectDB();
})
