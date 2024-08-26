
import ProductsModel from "@/models/productsModel";
import { Request, Response } from "express";
import connectToMongodb from '@/db/mongodb'
export default async function handler(req: Request, res: Response) {
  connectToMongodb();
  const { keywords } = req.body;
  try {
    if (req.method === 'POST') {
      // const p_fromDB = await Promise.all(keywords.map(async (keyword: string) =>
      //   (await ProductsModel.find({ product: { $regex: keyword, $options: 'i' } }))
      // ));
      // const p_merged = p_fromDB.reduce((products: string[], elem: string[]) =>
      //   ([...products, ...elem]), []);
      await ProductsModel.createIndexes();
      const p_fromDB = await ProductsModel.find(
        { $text: { $search: keywords.join(' ') } },
        { score: { $meta: "textScore" } }
      ).limit(1000).sort({ score: { $meta: "textScore" } }).exec();
      const products = p_fromDB.reduce((groups: any, product: any) => {
        const { class: productClass } = product;
        if (!groups[productClass]) {
          groups[productClass] = [];
        }
        groups[productClass].push(product);
        return groups;
      }, {});
      const arr_products = Object.keys(products).map(key => ({ _class: key, product: products[key] }));
      arr_products.forEach(elem => {
        elem.product.sort((a: any, b: any) => (b.score - a.score))
      })
      arr_products.sort((a:any,b:any)=>(b.product[0].score-a.product[0].score));

      // interface GroupedProduct {
      //   [key: string]: { product: string; class: string }[];
      // }

      // const groupedArray: { product: string; class: string }[][] = [];
      // const groups: GroupedProduct = {};

      // p_fromDB.forEach((product) => {
      //   const { class: productClass, ...rest } = product;

      //   if (!groups[productClass]) {
      //     groups[productClass] = [rest];console.log(groups[productClass])
      //     groupedArray.push(groups[productClass]);
      //   } else {
      //     groups[productClass].push(rest);
      //   }
      // });


      res.status(200).json({
        success: true,
        data: arr_products
      })
    } else {
      res.status(405).json({
        success: false,
        data: "Method not allowed."
      })
    }
  } catch (error) {
    console.log("API error", error);
    if (!res.headersSent) {
      res.status(200).json({
        success: false,
        data: "Server error",
      });
    }
  }
}