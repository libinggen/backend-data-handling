import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";
import { IsString, IsEmail, MinLength, MaxLength, Matches } from "class-validator";

@Entity()
@Index("unique_user_name", ["name"], { unique: true })
@Index("unique_user_email", ["email"], { unique: true })
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    @IsString()
    @MinLength(3)
    @MaxLength(50)
    name: string;

    @Column()
    @IsEmail()
    @MaxLength(250)
    email: string;

    @Column()
    @IsString()
    @MinLength(8)
    @MaxLength(14)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, { message: 'The password must be a combination of uppercase letters, lowercase letters, digits, and special characters.' })
    password: string;
}
