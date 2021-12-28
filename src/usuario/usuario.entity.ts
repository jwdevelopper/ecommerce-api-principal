import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import * as bcrypt from 'bcrypt';

@Entity()
@Unique(['email'])
export class Usuario extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false, type: 'varchar', length: 200 })
    email: string;

    @Column({ nullable: false, type: 'varchar', length: 250 })
    nome: string;

    @Column({ nullable: false, type: 'varchar', length: 20 })
    role: string;

    @Column({ nullable: false, default: true })
    status: boolean;

    @Column({ nullable: false })
    senha: string;

    @Column({ nullable: false })
    salt: string;

    @Column({ nullable: true, type: 'varchar', length: 64 })
    confirmacaoToken: string;

    @Column({ nullable: true, type: 'varchar', length: 64 })
    renovarToken: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    async checarSenha(senha:string): Promise<boolean> {
        const hash = await bcrypt.hash(senha, this.salt);
        return hash === this.senha;
    }
}