// src/admin/admin.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import {  UserStatus } from 'src/entities/user.entity';
// import { parseFeatures } from 'src/utils/parsefeatures';
import { Repository, ILike } from 'typeorm';
import { Payment } from 'src/payments/payment.entity';
import { Report } from 'src/reports/report.entity';
import { Plan } from 'src/plans/plan.entity';
import { Sub } from 'src/subscriptions/subscription.entity';
import { User } from 'src/users/entities/user.entity';
import { ReportStatus } from 'src/report.enum';
import { SubStatus, UserStatus } from 'src/status.enum';
import { parseFeatures } from 'src/common/utils/feactures.util';






@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User) private users: Repository<User>,
    @InjectRepository(Sub) private subs: Repository<Sub>,
    @InjectRepository(Plan) private plans: Repository<Plan>,
    @InjectRepository(Payment) private payments: Repository<Payment>,
    @InjectRepository(Report) private reports: Repository<Report>,
  ) {}

  //* Ok
  async overview() {
    const totalUsers = await this.users.count();
    const activeSubsFree = await this.subs.count({ where: { status: SubStatus.ENABLED } });
    const activeSubsPay = await this.subs.count({ where: { status: SubStatus.ACTIVE } });
    const openReports = await this.reports.count({
    where: { status: ReportStatus.PENDING },
    });

    const allPays = await this.payments.find();
    const revenueUSD = allPays
      .filter(p => p.status === 'active') // pagado/activo
      .reduce((acc, p) => acc + (p.billingCycle === 'annual' ? 0.30 : 0.10), 0);

    return { totalUsers, activeSubsFree, activeSubsPay, openReports, revenueUSD };
  }

  //* Ok 
  //Retorna el total de usuarios junto con sus datos y su plan activo.
  async listUsers(q = '', page = 1, limit = 20) {
    const where = q
      ? [
          { name: ILike(`%${q}%`) },
          { username: ILike(`%${q}%`) },
          { email: ILike(`%${q}%`) },
        ]
      : {};
    const [rows, total] = await this.users.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const ids = rows.map(r => r.id);
    const subs = await this.subs.find({
      where: ids.length ? ids.map(id => ({ user: { id } })) as any : {},
      relations: ['plan', 'user'],
    });
    const byUser = new Map(subs.map(s => [s.user.id, s]));

    const data = rows.map(u => {
      const s = byUser.get(u.id);
      
      const planName =
        s?.plan?.name ??
        (s?.plan?.type === 'annual' ? 'monthly' :
         s?.plan?.type === 'monthly' ? 'annual' : 'free');

      return {
        id: u.id,
        name: u.name ?? u.username ?? u.email,
        username: u.username,
        email: u.email,
        avatar: u.profilePicture ?? '',
        plan: planName,
        posts: u.pinsCount ?? 0,
        status: u.status,
        isAdmin: u.isAdmin,
        createdAt: u.createdAt,
      };
    });

    return { total, users: data };
  }

  //* Ok
  //Cambia el estado del usuario active ---> suspended
  async patchUserStatus(id: string, status: UserStatus) {
    await this.users.update({ id }, { status });
    return this.users.findOne({ where: { id } });
  }

  //! Revisar si se va a usar
  async patchUserRole(id: string, isAdmin: boolean) {
    await this.users.update({ id }, { isAdmin });
    return this.users.findOne({ where: { id } });
  }

  //* Ok
  //Trae todo los reportes esta repetido revisar si se va a usar
  async listReports() {
    return this.reports
    .createQueryBuilder('r')
    .orderBy('r.createdAt', 'DESC')
    .getMany();
  }

  //* Ok
  //Cambia el estado de un reporte
  async patchReportStatus(id: string, status: 'reviewed'|'resolved'|'dismissed') {
    await this.reports.update({ id } , { status } as any);
    return this.reports.findOne({ where: { id }  });
  }

  
  //* Ok
  //Trae las sub gratuitas esta repetido pero revisen cual van a usar
  async listSubscriptions() {
    const rows = await this.subs.find({ relations: ['user', 'plan'], order: { start_date: 'DESC' as any } as any });
    return rows.map(s => ({
      id: (s as any).id,
      userId: s.user.id,
      userName: s.user.name ?? s.user.username ?? s.user.email,
      email: s.user.email,
      plan: s.plan?.name ?? (s.plan?.type === 'annual' ? 'Business' : s.plan?.type === 'monthly' ? 'annual' : 'Free'),
      status: s.status,
      startedAt: (s as any).startsAt ?? s['createdAt'] ?? s['updatedAt'],
      renewsAt: (s as any).endsAt ?? null,
      pricePerMonth: s.plan?.price ?? (s.plan?.type === 'annual' ? 0.30 : s.plan?.type === 'monthly' ? 0.10 : 0),
      currency: s.plan?.currency ?? 'USD',
    }));
  }

  
  //* Ok
  //Trae las sub pagas esta repetido pero revisen cual van a usar
  async listPayments() {
    const pays = await this.payments.find({ relations: ['user'], order: { createdAt: 'DESC' as any } as any });
    return pays.map(p => {
      const usdPrice = p.billingCycle === 'annual' ? 0.30 : 0.10;
      const status = p.status === 'active' ? 'PAID' : (p.status === 'cancelled' ? 'CANCELLED' : 'EXPIRED');
      return {
        id: (p as any).id,
        date: p.createdAt,
        userId: p.user?.id,
        description: `${p.billingCycle === 'annual' ? 'Annual' : 'Monthly'} Premium (${usdPrice} USD)`,
        method: 'CARD',
        status,
        amount: usdPrice,
        currency: 'USD',
        email: p.user?.email,
      };
    });
  }

  
  //* Ok
  //Trae todos los planes tambien esta repetido esta repetido pero revisen cual van a usar
  async listPlans() {
    const rows = await this.plans.find({ order: { createdAt: 'DESC' } });
    return rows.map(p => ({
      id: p.id,
      name: p.name,
      pricePerMonth: Number(p.price),
      currency: p.currency as 'USD'|'ARS'|'COP',
      features: parseFeatures(p.features),
      isActive: p.isActive,
      createdAt: p.createdAt,
    }));
  }



  //! Revisar si se va a usar
//   async upsertPlan(dto: {
//     id?: string;
//     name: string;
//     price: number;
//     currency: 'USD' | 'COP' | 'ARS';
//     features: string;
//     isActive: boolean;
//     type?: 'free'|'monthly'|'annual';   // 👈 aquí el cambio
//   }) {
//     if (dto.id) {
//       await this.plans.update(
//         { id: dto.id },
//         {
//           name: dto.name,
//           price: dto.price,
//           currency: dto.currency,
//           features: dto.features,
//           isActive: dto.isActive,
//           type: dto.type ?? undefined,
//         },
//       );
//       return this.plans.findOne({ where: { id: dto.id } });
//     }

//   const created = this.plans.create({
//     name: dto.name,
//     pricePerMonth: dto.price,
//     currency: dto.currency,
//     featuresCsv: dto.features,
//     isActive: dto.isActive,
//     type: dto.type ?? undefined,
//   });
//   return this.plans.save(created);
// }


  // *Ok
  //Cambia el estado de un plan 
  async togglePlanActive(id: string) {
    const p = await this.plans.findOne({ where: { id } });
    if (!p) throw new NotFoundException("This Plan not found.");
    p.isActive = !p.isActive;
    return this.plans.save(p);
  }

  //* Ok
  //Borra un plan esta repetido 
  async deletePlan(id: string) {
    const plan =  await this.plans.findOne({where: {id: id}});
    if (!plan) throw new NotFoundException("This Plan not found.");
    const planRemove =  await this.plans.remove(plan);
    return {planRemove };
  }

}