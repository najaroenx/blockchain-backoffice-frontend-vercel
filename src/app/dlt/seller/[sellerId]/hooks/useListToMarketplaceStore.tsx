"use client";
import { db } from "@/libs/firebase"; // import จากไฟล์ที่เพิ่งสร้าง
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useState, useEffect } from "react";
enum OrderCollection {
  ORDER = "orders",
}
export interface IOrder {
  id: string;
  voucherId: string;
  amount: number;
  pricePerUnitTHB: number;
  sellerWalletAddress: string;
  total: number;
}
export interface IOrderInformation {
  id: string;
  action: string;
  status: "pending" | "processing" | "completed" | "error";
  result?: any;
  updatedAt: any;
  total: number;
}
export function useListToMarketplaceStore() {
  const [orders, setOrders] = useState<IOrderInformation[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [errorOrders, setErrorOrders] = useState<string | null>(null);

  useEffect(() => {
    const listingsRef = collection(db, OrderCollection.ORDER);
    const q = query(listingsRef, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const ordersData = snapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as IOrderInformation)
        );
        setOrders(ordersData);
        setLoadingOrders(false);
      },
      (err) => {
        console.error("Error fetching listings:", err);
        setErrorOrders("Failed to fetch listings");
        setLoadingOrders(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addOrder = async (
    listingData: IOrderInformation[],
    sellerWalletAddress: string
  ) => {
    try {
      setLoadingOrders(true);
      const docRef = await addDoc(collection(db, OrderCollection.ORDER), {
        data: listingData, // It's array of data voucher for list to marketplace
        sellerWalletAddress,
        createdAt: serverTimestamp(),
      });
      console.log("Listing added with ID:", docRef.id);
      return docRef.id;
    } catch (err) {
      console.error("Error adding listing:", err);
      setErrorOrders("Failed to add listing");
      return null;
    } finally {
      setLoadingOrders(false);
    }
  };
  const addOrdersToFirebase = async () => {
    try {
      setLoadingOrders(true);
      const docRef = await addDoc(collection(db, OrderCollection.ORDER), {
        voucherId: "mockup",
        amount: 0,
        pricePerUnitTHB: 0,
        sellerWalletAddress: "mockup",
        total: 0,
        action: "",
        status: "pending",
        result: null,
        updatedAt: serverTimestamp(),
      });
      console.log("Listing added with ID:", docRef.id);
      return docRef.id;
    } catch (err) {
      console.error("Error adding listing:", err);
      setErrorOrders("Failed to add listing");
      return null;
    } finally {
      setLoadingOrders(false);
    }
  };

  return { orders, loadingOrders, errorOrders, addOrder, addOrdersToFirebase };
}
