'use client';
import { useEffect } from 'react';
import { reportQuestValidation } from '@/lib/quest-validation';
export default function QuestValidation(){useEffect(()=>{if(process.env.NODE_ENV!=='production')reportQuestValidation()},[]);return null}
