import mysqldb from "./mysqldb"
import { Request, Response } from "express"

export const find = (req:Request, res:Response) => {
    // get all users
    mysqldb.query('SELECT * FROM users', (err, results) => {
        if (err) throw err
        res.status(200).json(results)
    })
}
export const findByEmail = ({ req, res }:{req:Request, res:Response}, email:string) => {
    // get all users
    mysqldb.query('SELECT * FROM users WHERE email = ?', [email], (err, results, fields) => {
        if (err) throw err
        res.status(200).json(results)
    })
}
export const insert = (req:Request, res:Response) => {
    // create a new user
    const { given_name, family_name, picture, email, name, password } = req.body
    mysqldb.query('INSERT INTO users SET ?', { given_name, family_name, picture, email, name, password }, (err, result) => {
        if (err) throw err
        res.status(201).json([{ given_name, family_name, picture, email, name,password, ID: result.insertId }])
    })
}
export const update = (req:Request, res:Response) => {
    /// update a user by ID
    const { id, name, email } = req.body
    mysqldb.query('UPDATE users SET name=?, email=? WHERE id=?', [name, email, id], (err, result) => {
        if (err) throw err
        res.status(200).json({ message: 'User updated successfully' })
    })
}
export const remove = (req:Request, res:Response) => {
    // delete a user by ID
    const { id } = req.body
    mysqldb.query('DELETE FROM users WHERE id=?', id, (err, result) => {
        if (err) throw err
        res.status(200).json({ message: 'User deleted successfully' })
    })
}