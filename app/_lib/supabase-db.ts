import { supabase } from '../lib/supabase';
import type { Activity, ProjectStatus } from './types';

export async function addActivity(activity: Omit<Activity, 'id' | 'at'> & { at?: string }) {
  const { data, error } = await supabase
    .from('activities')
    .insert({
      kind: activity.kind,
      company_slug: activity.companySlug,
      project_slug: activity.projectSlug,
      prototype_id: activity.prototypeId,
      message: activity.message,
      created_at: activity.at || new Date().toISOString(),
    })
    .select();

  if (error) console.error('Error adding activity:', error);
  return data?.[0];
}

export async function getActivities(companySlug?: string, limit = 60) {
  let query = supabase
    .from('activities')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (companySlug) {
    query = query.eq('company_slug', companySlug);
  }

  const { data, error } = await query;
  if (error) console.error('Error fetching activities:', error);

  return data?.map((row) => ({
    id: row.id,
    kind: row.kind,
    at: row.created_at,
    companySlug: row.company_slug,
    projectSlug: row.project_slug,
    prototypeId: row.prototype_id,
    message: row.message,
  })) || [];
}

export async function updateProjectEdit(
  companySlug: string,
  projectSlug: string,
  updates: { name?: string; status?: string }
) {
  const { data, error } = await supabase
    .from('project_edits')
    .upsert(
      {
        company_slug: companySlug,
        project_slug: projectSlug,
        ...updates,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'company_slug,project_slug' }
    )
    .select();

  if (error) console.error('Error updating project:', error);
  return data?.[0];
}

export async function getProjectEdits(companySlug?: string) {
  let query = supabase.from('project_edits').select('*');

  if (companySlug) {
    query = query.eq('company_slug', companySlug);
  }

  const { data, error } = await query;
  if (error) console.error('Error fetching project edits:', error);

  return (
    data?.map((row) => ({
      companySlug: row.company_slug as string,
      projectSlug: row.project_slug as string,
      name: row.name as string | undefined,
      status: row.status as ProjectStatus | undefined,
      updatedAt: row.updated_at as string | undefined,
    })) || []
  );
}

export async function getProjectEdit(companySlug: string, projectSlug: string) {
  const { data, error } = await supabase
    .from('project_edits')
    .select('*')
    .eq('company_slug', companySlug)
    .eq('project_slug', projectSlug)
    .single();

  if (error && error.code !== 'PGRST116') console.error('Error fetching project edit:', error);
  return data;
}

export async function getProjectStats(companySlug: string, month: string) {
  const { data, error } = await supabase
    .from('project_stats')
    .select('*')
    .eq('company_slug', companySlug)
    .eq('month', month);

  if (error) console.error('Error fetching stats:', error);
  return data || [];
}

export async function saveWorkspaceShare(companySlug: string, url: string) {
  const { data, error } = await supabase
    .from('workspace_shares')
    .insert({
      company_slug: companySlug,
      shared_url: url,
      created_at: new Date().toISOString(),
    })
    .select();

  if (error) console.error('Error saving share:', error);
  return data?.[0];
}

export async function trackAccess(companySlug: string, month: string) {
  const { data: existing, error: fetchError } = await supabase
    .from('project_stats')
    .select('access_count')
    .eq('company_slug', companySlug)
    .is('project_slug', null)
    .eq('month', month)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    console.error('Error fetching access count:', fetchError);
  }

  const nextCount = (existing?.access_count || 0) + 1;

  const { error } = await supabase
    .from('project_stats')
    .upsert(
      {
        company_slug: companySlug,
        project_slug: null,
        month,
        access_count: nextCount,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'company_slug,project_slug,month' }
    );

  if (error) console.error('Error tracking access:', error);
}

export async function getTotalAccesses(companySlug: string, month: string) {
  const { data, error } = await supabase
    .from('project_stats')
    .select('access_count')
    .eq('company_slug', companySlug)
    .eq('month', month)
    .is('project_slug', null)
    .single();

  if (error && error.code !== 'PGRST116') console.error('Error fetching accesses:', error);
  return data?.access_count || 0;
}
